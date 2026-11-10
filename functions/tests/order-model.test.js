import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCustomerOrder } from '../src/order-service.js';

function createFakeDb({ settings, products = {}, categories = {}, groups = {}, options = {} }) {
  const documents = new Map([
    ['settings/public', settings],
    ...Object.entries(products).map(([id, value]) => [`products/${id}`, value]),
    ...Object.entries(categories).map(([id, value]) => [`categories/${id}`, value]),
    ...Object.entries(groups).map(([id, value]) => [`optionGroups/${id}`, value]),
    ...Object.entries(options).map(([path, value]) => [path, value]),
  ]);
  const writes = new Map();
  const db = {
    collection(name) {
      return {
        doc(id) {
          const path = id ? `${name}/${id}` : `${name}/generated-order-id`;
          return {
            id: id || 'generated-order-id',
            path,
            collection(child) {
              return { doc: () => ({ id: 'event-id', path: `${path}/${child}/event-id` }) };
            },
          };
        },
      };
    },
    doc(path) {
      return { path };
    },
    async runTransaction(callback) {
      const transaction = {
        async get(ref) {
          return { exists: documents.has(ref.path), data: () => documents.get(ref.path) };
        },
        create(ref, value) {
          writes.set(ref.path, value);
          documents.set(ref.path, value);
        },
      };
      return callback(transaction);
    },
  };
  return { db, documents, writes };
}

const settings = {
  orderingEnabled: true,
  currencyCode: 'PKR',
  fulfilmentMethods: { delivery: true, pickup: true },
  deliveryFeeMinor: 250,
  deliveryAreas: [{ id: 'area-1', active: true }],
  taxEnabled: false,
};
const product = {
  active: true,
  available: true,
  name: 'Test burger',
  categoryId: 'burgers',
  priceMinor: 1000,
  optionGroupIds: ['size'],
};
const group = { active: true, name: 'Size', selectionType: 'single', required: true, minSelections: 1, maxSelections: 1 };
const option = { active: true, name: 'Regular', priceDeltaMinor: 0 };

function payload(overrides = {}) {
  return {
    idempotencyKey: 'a-random-unique-submission-key-12345',
    items: [{ productId: 'burger-1', quantity: 2, selections: [{ groupId: 'size', optionIds: ['regular'] }] }],
    fulfilmentType: 'delivery',
    paymentMethod: 'COD',
    customer: { name: 'Test Customer', phone: '+923001234567' },
    deliveryAddress: { areaId: 'area-1', addressLine: 'Test street 1' },
    ...overrides,
  };
}

function fakeData() {
  return {
    settings,
    products: { 'burger-1': product },
    categories: { burgers: { active: true } },
    groups: { size: group },
    options: { 'optionGroups/size/options/regular': option },
  };
}

test('trusted order totals use server catalogue values, not client prices', async () => {
  const { db, writes } = createFakeDb(fakeData());
  const result = await createCustomerOrder({ db, uid: 'customer-1', authUser: { email: 'a@example.com' }, payload: payload() });
  const order = writes.get(`orders/${result.orderId}`);
  assert.equal(order.totals.subtotalMinor, 2000);
  assert.equal(order.totals.deliveryFeeMinor, 250);
  assert.equal(order.totals.totalMinor, 2250);
  assert.equal(order.items[0].unitPriceMinor, 1000);
  assert.equal(order.paymentStatus, 'unpaid');
  assert.equal(order.status, 'pending_confirmation');
});

test('pickup requires COP and does not add a delivery fee', async () => {
  const { db, writes } = createFakeDb(fakeData());
  const result = await createCustomerOrder({
    db, uid: 'customer-1', authUser: {},
    payload: payload({ fulfilmentType: 'pickup', paymentMethod: 'COP', deliveryAddress: null }),
  });
  const order = writes.get(`orders/${result.orderId}`);
  assert.equal(order.totals.deliveryFeeMinor, 0);
  assert.equal(order.totals.totalMinor, 2000);
});

test('idempotent retry returns the original order without creating another', async () => {
  const { db, writes } = createFakeDb(fakeData());
  const first = await createCustomerOrder({ db, uid: 'customer-1', authUser: {}, payload: payload() });
  const second = await createCustomerOrder({ db, uid: 'customer-1', authUser: {}, payload: payload() });
  assert.equal(second.orderId, first.orderId);
  assert.equal(second.replayed, true);
  assert.equal([...writes.keys()].filter((path) => path.startsWith('orders/')).length, 2);
});

test('reusing an idempotency key with a different request is rejected', async () => {
  const { db } = createFakeDb(fakeData());
  await createCustomerOrder({ db, uid: 'customer-1', authUser: {}, payload: payload() });
  await assert.rejects(
    createCustomerOrder({ db, uid: 'customer-1', authUser: {}, payload: payload({ notes: 'Changed request' }) }),
    (error) => error.code === 'already-exists',
  );
});

test('inactive products, invalid options and unavailable areas are rejected', async () => {
  const inactive = createFakeDb({ ...fakeData(), products: { 'burger-1': { ...product, active: false } } });
  await assert.rejects(
    createCustomerOrder({ db: inactive.db, uid: 'customer-1', authUser: {}, payload: payload() }),
    (error) => error.code === 'failed-precondition',
  );

  const badOption = createFakeDb({ ...fakeData(), options: {} });
  await assert.rejects(
    createCustomerOrder({ db: badOption.db, uid: 'customer-1', authUser: {}, payload: payload() }),
    (error) => error.code === 'failed-precondition',
  );

  const badArea = createFakeDb({ ...fakeData(), settings: { ...settings, deliveryAreas: [] } });
  await assert.rejects(
    createCustomerOrder({ db: badArea.db, uid: 'customer-1', authUser: {}, payload: payload() }),
    (error) => error.code === 'failed-precondition',
  );
});

test('missing tax policy fails closed rather than silently applying zero tax', async () => {
  const { db } = createFakeDb({ ...fakeData(), settings: { ...settings, taxEnabled: undefined } });
  await assert.rejects(
    createCustomerOrder({ db, uid: 'customer-1', authUser: {}, payload: payload() }),
    (error) => error.code === 'failed-precondition',
  );
});
