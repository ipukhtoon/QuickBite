import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { getFirebaseServices } from '../firebase/client.js';

function databaseOrThrow() {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase is not configured for this environment.');
  return services.db;
}

export async function fetchPublicSettings() {
  const db = databaseOrThrow();
  const snapshot = await getDoc(doc(db, 'settings/public'));
  if (!snapshot.exists()) throw new Error('Public restaurant settings have not been configured.');
  const settings = snapshot.data();
  if (typeof settings.currencyCode !== 'string' || !/^[A-Z]{3}$/.test(settings.currencyCode)) {
    throw new Error('The restaurant currency has not been configured correctly.');
  }
  try {
    new Intl.NumberFormat(undefined, { style: 'currency', currency: settings.currencyCode });
  } catch {
    throw new Error('The restaurant currency code is not supported.');
  }
  return settings;
}

export async function fetchActiveCategories() {
  const db = databaseOrThrow();
  const result = await getDocs(query(
    collection(db, 'categories'),
    where('active', '==', true),
    orderBy('sortOrder', 'asc'),
  ));
  return result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
}

async function loadOptionGroup(db, groupId) {
    const groupSnapshot = await getDoc(doc(db, 'optionGroups', groupId));
    if (!groupSnapshot.exists()) return null;
    const group = groupSnapshot.data();
    if (group.active !== true) return { valid: false };
    if (!['single', 'multiple'].includes(group.selectionType)) return { valid: false };
    const optionsSnapshot = await getDocs(query(
      collection(db, 'optionGroups', groupId, 'options'),
      where('active', '==', true),
      orderBy('sortOrder', 'asc'),
    ));
    const choices = optionsSnapshot.docs.map((optionSnapshot) => {
      const option = optionSnapshot.data();
      return {
        id: optionSnapshot.id,
        label: option.name,
        deltaMinor: option.priceDeltaMinor,
        valid: typeof option.name === 'string' && option.name.length > 0 && Number.isInteger(option.priceDeltaMinor),
      };
    });
    if (choices.some((choice) => !choice.valid)) return { valid: false };
    const required = group.required === true;
    const min = Number.isInteger(group.minSelections) ? group.minSelections : (required ? 1 : 0);
    const max = Number.isInteger(group.maxSelections) ? group.maxSelections : (group.selectionType === 'single' ? 1 : choices.length);
    if (min < 0 || max < min || max > choices.length || (group.selectionType === 'single' && max > 1)) {
      return { valid: false };
    }
    if (choices.length === 0 && min > 0) return { valid: false };
    return {
      valid: true,
      group: {
        id: groupSnapshot.id,
        name: group.name,
        type: group.selectionType,
        required,
        min,
        max,
        choices: choices.map(({ valid, ...choice }) => choice),
      },
    };
}

async function fetchOptionGroups(db, groupIds = [], cache = new Map()) {
  const uniqueIds = [...new Set(groupIds)].filter((id) => typeof id === 'string' && id.length > 0);
  const results = await Promise.all(uniqueIds.map((groupId) => {
    if (!cache.has(groupId)) cache.set(groupId, loadOptionGroup(db, groupId));
    return cache.get(groupId);
  }));
  return {
    valid: results.every((result) => result && result.valid),
    groups: results.filter((result) => result && result.valid).map((result) => result.group),
  };
}

export async function fetchActiveProducts({ categoryId } = {}) {
  const db = databaseOrThrow();
  const constraints = [where('active', '==', true)];
  if (categoryId) constraints.push(where('categoryId', '==', categoryId));
  constraints.push(orderBy('sortOrder', 'asc'));
  const result = await getDocs(query(collection(db, 'products'), ...constraints));
  const optionGroupCache = new Map();
  return Promise.all(result.docs.map(async (snapshot) => {
    const product = snapshot.data();
    const optionResult = await fetchOptionGroups(db, product.optionGroupIds || [], optionGroupCache);
    const validPrice = Number.isInteger(product.priceMinor) && product.priceMinor >= 0;
    return {
      id: snapshot.id,
      name: typeof product.name === 'string' ? product.name : '',
      description: product.description || '',
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || '',
      priceMinor: product.priceMinor,
      available: product.available !== false && validPrice && optionResult.valid && typeof product.name === 'string' && product.name.length > 0,
      optionGroups: optionResult.groups,
    };
  }));
}
