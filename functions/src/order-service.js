import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';

const MAX_LINES = 20;
const MAX_GROUPS_PER_PRODUCT = 5;
const MAX_OPTIONS_PER_GROUP = 5;
const MAX_TOTAL_SELECTED_OPTIONS = 100;
const MAX_QUANTITY = 99;
const MAX_NOTE_LENGTH = 500;

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function validText(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

function roundRatio(numerator, denominator) {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    fail('invalid-argument', 'The configured tax calculation is invalid.');
  }
  return Math.floor((numerator + Math.floor(denominator / 2)) / denominator);
}

function calculateTotals(subtotalMinor, deliveryFeeMinor, settings) {
  if (typeof settings.taxEnabled !== 'boolean') {
    fail('failed-precondition', 'Restaurant tax settings have not been configured.');
  }
  let taxMinor = 0;
  if (settings.taxEnabled) {
    if (!Number.isInteger(settings.taxRateBps) || settings.taxRateBps < 0 || settings.taxRateBps > 10000
      || typeof settings.taxInclusive !== 'boolean'
      || typeof settings.taxAppliesToDelivery !== 'boolean') {
      fail('failed-precondition', 'Restaurant tax settings are incomplete.');
    }
    const taxable = subtotalMinor + (settings.taxAppliesToDelivery ? deliveryFeeMinor : 0);
    taxMinor = settings.taxInclusive
      ? roundRatio(taxable * settings.taxRateBps, 10000 + settings.taxRateBps)
      : roundRatio(taxable * settings.taxRateBps, 10000);
  }
  const totalMinor = subtotalMinor + deliveryFeeMinor + (settings.taxInclusive ? 0 : taxMinor);
  if (![subtotalMinor, deliveryFeeMinor, taxMinor, totalMinor].every(Number.isSafeInteger)
    || [subtotalMinor, deliveryFeeMinor, taxMinor, totalMinor].some((value) => value < 0)) {
    fail('invalid-argument', 'The order total is outside the supported range.');
  }
  return { subtotalMinor, deliveryFeeMinor, taxMinor, totalMinor };
}

function normalizeRequest(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    fail('invalid-argument', 'Invalid order request.');
  }
  const { idempotencyKey, items, fulfilmentType, paymentMethod, customer, deliveryAddress, notes } = payload;
  if (!validText(idempotencyKey, 128) || idempotencyKey.trim().length < 20) {
    fail('invalid-argument', 'A unique order submission key is required.');
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > MAX_LINES) {
    fail('invalid-argument', 'Your cart must contain between 1 and 30 items.');
  }
  if (!['delivery', 'pickup'].includes(fulfilmentType)) {
    fail('invalid-argument', 'Choose delivery or pickup.');
  }
  if ((fulfilmentType === 'delivery' && paymentMethod !== 'COD')
    || (fulfilmentType === 'pickup' && paymentMethod !== 'COP')) {
    fail('invalid-argument', 'Choose the cash payment method that matches your fulfilment method.');
  }
  if (!customer || !validText(customer.name, 80) || !validText(customer.phone, 32)) {
    fail('invalid-argument', 'Enter your name and a valid contact phone number.');
  }
  if (notes != null && (typeof notes !== 'string' || notes.length > MAX_NOTE_LENGTH)) {
    fail('invalid-argument', 'Order notes must be 500 characters or fewer.');
  }
  if (fulfilmentType === 'delivery') {
    if (!deliveryAddress || !validText(deliveryAddress.areaId, 100)
      || !validText(deliveryAddress.addressLine, 180)) {
      fail('invalid-argument', 'Enter your delivery area and address.');
    }
    if (deliveryAddress.instructions != null
      && (typeof deliveryAddress.instructions !== 'string' || deliveryAddress.instructions.length > 300)) {
      fail('invalid-argument', 'Delivery instructions must be 300 characters or fewer.');
    }
  }
  let totalSelectedOptions = 0;
  const normalizedItems = items.map((item) => {
    if (!item || !validText(item.productId, 128) || !Number.isInteger(item.quantity)
      || item.quantity < 1 || item.quantity > MAX_QUANTITY || !Array.isArray(item.selections)) {
      fail('invalid-argument', 'One or more cart items are invalid.');
    }
    if (item.selections.length > MAX_GROUPS_PER_PRODUCT) {
      fail('invalid-argument', 'An item contains too many option groups.');
    }
    return {
      productId: item.productId,
      quantity: item.quantity,
      selections: item.selections.map((selection) => {
        if (!selection || !validText(selection.groupId, 128) || !Array.isArray(selection.optionIds)
          || selection.optionIds.some((id) => !validText(id, 128))) {
          fail('invalid-argument', 'One or more product options are invalid.');
        }
        const uniqueOptionIds = [...new Set(selection.optionIds)].sort();
        if (uniqueOptionIds.length > MAX_OPTIONS_PER_GROUP) {
          fail('invalid-argument', 'Choose fewer options for this item.');
        }
        totalSelectedOptions += uniqueOptionIds.length;
        if (totalSelectedOptions > MAX_TOTAL_SELECTED_OPTIONS) {
          fail('invalid-argument', 'Your cart contains too many option selections.');
        }
        return { groupId: selection.groupId, optionIds: uniqueOptionIds };
      }).sort((a, b) => a.groupId.localeCompare(b.groupId)),
    };
  });
  return {
    idempotencyKey: idempotencyKey.trim(),
    items: normalizedItems,
    fulfilmentType,
    paymentMethod,
    customer: { name: customer.name.trim(), phone: customer.phone.trim() },
    deliveryAddress: fulfilmentType === 'delivery' ? {
      areaId: deliveryAddress.areaId.trim(),
      addressLine: deliveryAddress.addressLine.trim(),
      instructions: (deliveryAddress.instructions || '').trim(),
    } : null,
    notes: (notes || '').trim(),
  };
}

async function buildItemSnapshot(transaction, db, item) {
  const productRef = db.collection('products').doc(item.productId);
  const productSnapshot = await transaction.get(productRef);
  if (!productSnapshot.exists) fail('failed-precondition', 'A product in your cart is no longer available.');
  const product = productSnapshot.data();
  if (product.active !== true || product.available === false
    || !validText(product.name, 160) || !Number.isSafeInteger(product.priceMinor) || product.priceMinor < 0
    || !Array.isArray(product.optionGroupIds || [])) {
    fail('failed-precondition', 'A product in your cart is no longer available.');
  }

  if (product.categoryId) {
    const categorySnapshot = await transaction.get(db.collection('categories').doc(product.categoryId));
    if (!categorySnapshot.exists || categorySnapshot.data().active !== true) {
      fail('failed-precondition', 'A product category is no longer available.');
    }
  }

  const groupIds = product.optionGroupIds || [];
  if (groupIds.length > MAX_GROUPS_PER_PRODUCT
    || groupIds.some((id) => !validText(id, 128))
    || new Set(groupIds).size !== groupIds.length) {
    fail('failed-precondition', 'Product options are not configured correctly.');
  }
  const selectionsByGroup = new Map(item.selections.map((selection) => [selection.groupId, selection.optionIds]));
  if (selectionsByGroup.size !== item.selections.length
    || selectionsByGroup.size !== groupIds.length
    || groupIds.some((groupId) => !selectionsByGroup.has(groupId))) {
    fail('invalid-argument', 'Review the options selected for an item in your cart.');
  }

  let optionDeltaMinor = 0;
  const optionSnapshots = [];
  for (const groupId of groupIds) {
    const groupSnapshot = await transaction.get(db.collection('optionGroups').doc(groupId));
    if (!groupSnapshot.exists) fail('failed-precondition', 'A product option is no longer available.');
    const group = groupSnapshot.data();
    if (group.active !== true || !['single', 'multiple'].includes(group.selectionType)) {
      fail('failed-precondition', 'A product option is no longer available.');
    }
    const optionIds = selectionsByGroup.get(groupId);
    const min = Number.isInteger(group.minSelections) ? group.minSelections : (group.required ? 1 : 0);
    const max = Number.isInteger(group.maxSelections) ? group.maxSelections : (group.selectionType === 'single' ? 1 : 99);
    if (max > MAX_OPTIONS_PER_GROUP || optionIds.length < min || optionIds.length > max
      || (group.selectionType === 'single' && optionIds.length > 1)) {
      fail('invalid-argument', 'Choose the required product options before continuing.');
    }
    const selected = [];
    for (const optionId of optionIds) {
      const optionSnapshot = await transaction.get(
        db.collection('optionGroups').doc(groupId).collection('options').doc(optionId),
      );
      if (!optionSnapshot.exists) fail('failed-precondition', 'A selected option is no longer available.');
      const option = optionSnapshot.data();
      if (option.active !== true || !validText(option.name, 100)
        || !Number.isSafeInteger(option.priceDeltaMinor)) {
        fail('failed-precondition', 'A selected option is no longer available.');
      }
      optionDeltaMinor += option.priceDeltaMinor;
      selected.push({ id: optionId, name: option.name, priceDeltaMinor: option.priceDeltaMinor });
    }
    optionSnapshots.push({ groupId, groupName: group.name, options: selected });
  }

  const unitPriceMinor = product.priceMinor + optionDeltaMinor;
  const lineTotalMinor = unitPriceMinor * item.quantity;
  if (!Number.isSafeInteger(unitPriceMinor) || unitPriceMinor < 0 || !Number.isSafeInteger(lineTotalMinor)) {
    fail('failed-precondition', 'A product price is invalid.');
  }
  return {
    productId: item.productId,
    name: product.name,
    imageUrl: typeof product.imageUrl === 'string' ? product.imageUrl : '',
    quantity: item.quantity,
    basePriceMinor: product.priceMinor,
    optionDeltaMinor,
    unitPriceMinor,
    lineTotalMinor,
    selections: optionSnapshots,
  };
}

export async function createCustomerOrder({ db, uid, authUser, payload }) {
  if (!uid) fail('unauthenticated', 'Sign in before placing an order.');
  const request = normalizeRequest(payload);
  const requestFingerprint = sha256(JSON.stringify(canonicalize(request)));
  const idempotencyDocId = sha256(`${uid}:${request.idempotencyKey}`);
  const idempotencyRef = db.collection('idempotencyKeys').doc(idempotencyDocId);
  const orderRef = db.collection('orders').doc();

  return db.runTransaction(async (transaction) => {
    const previous = await transaction.get(idempotencyRef);
    if (previous.exists) {
      const stored = previous.data();
      if (stored.customerUid !== uid || stored.requestFingerprint !== requestFingerprint) {
        fail('already-exists', 'This order submission key has already been used. Refresh your cart and try again.');
      }
      return { orderId: stored.orderId, replayed: true };
    }

    const settingsSnapshot = await transaction.get(db.doc('settings/public'));
    if (!settingsSnapshot.exists) fail('failed-precondition', 'Restaurant ordering is not configured yet.');
    const settings = settingsSnapshot.data();
    if (settings.orderingEnabled !== true) fail('failed-precondition', 'The restaurant is not accepting orders right now.');
    if (typeof settings.currencyCode !== 'string' || !/^[A-Z]{3}$/.test(settings.currencyCode)) {
      fail('failed-precondition', 'Restaurant currency is not configured.');
    }
    if (!settings.fulfilmentMethods || settings.fulfilmentMethods[request.fulfilmentType] !== true) {
      fail('failed-precondition', 'The selected fulfilment method is not currently available.');
    }
    let deliveryFeeMinor = 0;
    if (request.fulfilmentType === 'delivery') {
      if (!Number.isSafeInteger(settings.deliveryFeeMinor) || settings.deliveryFeeMinor < 0
        || !Array.isArray(settings.deliveryAreas)) {
        fail('failed-precondition', 'Restaurant delivery settings are incomplete.');
      }
      const area = settings.deliveryAreas.find((entry) => entry?.id === request.deliveryAddress.areaId && entry.active === true);
      if (!area) fail('failed-precondition', 'Delivery is not available in the selected area.');
      deliveryFeeMinor = settings.deliveryFeeMinor;
    }

    const itemSnapshots = [];
    let subtotalMinor = 0;
    for (const item of request.items) {
      const snapshot = await buildItemSnapshot(transaction, db, item);
      itemSnapshots.push(snapshot);
      subtotalMinor += snapshot.lineTotalMinor;
      if (!Number.isSafeInteger(subtotalMinor)) fail('failed-precondition', 'The order subtotal is too large.');
    }

    const totals = calculateTotals(subtotalMinor, deliveryFeeMinor, settings);
    const currencyCode = settings.currencyCode;
    const customerSnapshot = {
      name: request.customer.name,
      phone: request.customer.phone,
      email: typeof authUser?.email === 'string' ? authUser.email : null,
    };
    const order = {
      customerUid: uid,
      status: 'pending_confirmation',
      paymentMethod: request.paymentMethod,
      paymentStatus: 'unpaid',
      fulfilmentType: request.fulfilmentType,
      customer: customerSnapshot,
      deliveryAddress: request.deliveryAddress,
      notes: request.notes,
      items: itemSnapshots,
      totals: { ...totals, currencyCode },
      idempotencyKeyHash: idempotencyDocId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    transaction.create(orderRef, order);
    transaction.create(idempotencyRef, {
      customerUid: uid,
      requestFingerprint,
      orderId: orderRef.id,
      createdAt: FieldValue.serverTimestamp(),
    });
    transaction.create(orderRef.collection('events').doc(), {
      type: 'submitted',
      fromStatus: null,
      toStatus: 'pending_confirmation',
      actorUid: uid,
      actorRole: 'customer',
      createdAt: FieldValue.serverTimestamp(),
    });
    return { orderId: orderRef.id, replayed: false };
  });
}
