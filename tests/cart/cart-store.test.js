import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { CartStore } from '../../src/features/cart/cart-store.js';

async function createStore() {
  const factory = new IDBFactory();
  globalThis.indexedDB = factory;
  globalThis.window = { indexedDB: factory };
  return CartStore.create();
}

afterEach(() => {
  delete globalThis.indexedDB;
  delete globalThis.window;
});

function product(overrides = {}) {
  return {
    id: 'product-1',
    name: 'Test item',
    description: '',
    priceMinor: 1200,
    currencyCode: 'PKR',
    optionIds: ['size:regular'],
    options: [],
    optionSummary: 'Regular',
    ...overrides,
  };
}

test('guest cart is retained for guest state and cleared when an account signs in', async () => {
  const store = await createStore();
  await store.setOwner(null);
  await store.add(product());
  assert.equal((await store.read()).length, 1);

  const switched = await store.setOwner('customer-a');
  assert.equal(switched.cleared, true);
  assert.deepEqual(await store.read(), []);
});

test('same customer retains cart, but sign-out and account switching clear it', async () => {
  const store = await createStore();
  await store.setOwner('customer-a');
  await store.add(product());

  assert.equal((await store.setOwner('customer-a')).cleared, false);
  assert.equal((await store.read()).length, 1);

  assert.equal((await store.setOwner('customer-b')).cleared, true);
  assert.deepEqual(await store.read(), []);

  await store.add(product());
  assert.equal((await store.setOwner(null)).cleared, true);
  assert.deepEqual(await store.read(), []);
});

test('serialized rapid quantity adjustments are not lost', async () => {
  const store = await createStore();
  await store.setOwner(null);
  await store.add(product());
  const key = 'product-1::size:regular';

  await Promise.all([
    store.adjustQuantity(key, 1),
    store.adjustQuantity(key, 1),
    store.adjustQuantity(key, 1),
  ]);

  const [line] = await store.read();
  assert.equal(line.quantity, 4);
});

test('different option selections remain separate cart lines', async () => {
  const store = await createStore();
  await store.add(product({ optionIds: ['size:regular'] }));
  await store.add(product({ optionIds: ['size:large'], optionSummary: 'Large', priceMinor: 1500 }));

  const lines = await store.read();
  assert.equal(lines.length, 2);
  assert.deepEqual(lines.map((line) => line.quantity), [1, 1]);
});

test('legacy cart rows are normalized without losing their items', async () => {
  const store = await createStore();
  await store.write([{
    productId: 'legacy-product',
    name: 'Legacy item',
    priceMinor: 500,
    quantity: 2,
  }]);

  const [line] = await store.read();
  assert.equal(line.productId, 'legacy-product');
  assert.deepEqual(line.optionIds, []);
  assert.equal(line.currencyCode, null);
  assert.equal(line.lineKey, 'legacy-product::');
});
