import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transitionOrderStatus } from '../src/order-workflow.js';

function fakeDb({ staff, order }) {
  const docs = new Map([
    ['staff/staff-1', staff],
    ['orders/order-id-1234567890', order],
  ]);
  const writes = [];
  const db = {
    collection(name) {
      return { doc(id) {
        const path = `${name}/${id}`;
        return {
          path,
          collection(child) {
            return { doc: () => ({ path: `${path}/${child}/event-1` }) };
          },
        };
      } };
    },
    async runTransaction(callback) {
      const tx = {
        async get(ref) {
          return { exists: docs.has(ref.path), data: () => docs.get(ref.path) };
        },
        update(ref, value) {
          docs.set(ref.path, { ...docs.get(ref.path), ...value });
          writes.push({ type: 'update', path: ref.path, value });
        },
        create(ref, value) {
          docs.set(ref.path, value);
          writes.push({ type: 'create', path: ref.path, value });
        },
      };
      return callback(tx);
    },
  };
  return { db, docs, writes };
}

const baseOrder = {
  status: 'pending_confirmation',
  paymentStatus: 'unpaid',
  fulfilmentType: 'delivery',
};

test('active staff can advance an order and an audit event is created', async () => {
  const { db, docs, writes } = fakeDb({
    staff: { active: true, role: 'staff' },
    order: baseOrder,
  });
  const result = await transitionOrderStatus({
    db,
    actorUid: 'staff-1',
    payload: { orderId: 'order-id-1234567890', toStatus: 'accepted' },
  });
  assert.equal(result.replayed, false);
  assert.equal(docs.get('orders/order-id-1234567890').status, 'accepted');
  assert.equal(writes.find((item) => item.type === 'create').value.actorRole, 'staff');
});

test('inactive and non-staff users cannot change order status', async () => {
  for (const staff of [{ active: false, role: 'admin' }, { active: true, role: 'customer' }]) {
    const { db } = fakeDb({ staff, order: baseOrder });
    await assert.rejects(
      transitionOrderStatus({
        db,
        actorUid: 'staff-1',
        payload: { orderId: 'order-id-1234567890', toStatus: 'accepted' },
      }),
      (error) => error.code === 'permission-denied',
    );
  }
});

test('invalid state transitions and fulfilment mismatches are rejected', async () => {
  const { db } = fakeDb({ staff: { active: true, role: 'staff' }, order: baseOrder });
  await assert.rejects(
    transitionOrderStatus({
      db, actorUid: 'staff-1',
      payload: { orderId: 'order-id-1234567890', toStatus: 'completed', cashCollected: true },
    }),
    (error) => error.code === 'failed-precondition',
  );
});

test('cash is not marked paid until staff confirms collection at completion', async () => {
  const { db, docs } = fakeDb({
    staff: { active: true, role: 'staff' },
    order: { ...baseOrder, status: 'out_for_delivery' },
  });
  await assert.rejects(
    transitionOrderStatus({
      db, actorUid: 'staff-1',
      payload: { orderId: 'order-id-1234567890', toStatus: 'completed', cashCollected: false },
    }),
    (error) => error.code === 'failed-precondition',
  );

  await transitionOrderStatus({
    db, actorUid: 'staff-1',
    payload: { orderId: 'order-id-1234567890', toStatus: 'completed', cashCollected: true },
  });
  assert.equal(docs.get('orders/order-id-1234567890').paymentStatus, 'paid');
  assert.equal(docs.get('orders/order-id-1234567890').status, 'completed');
});

test('same target status retry does not create duplicate transition', async () => {
  const { db, writes } = fakeDb({
    staff: { active: true, role: 'staff' },
    order: { ...baseOrder, status: 'accepted' },
  });
  const result = await transitionOrderStatus({
    db, actorUid: 'staff-1',
    payload: { orderId: 'order-id-1234567890', toStatus: 'accepted' },
  });
  assert.equal(result.replayed, true);
  assert.equal(writes.length, 0);
});
