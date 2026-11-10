import { FieldValue } from 'firebase-admin/firestore';

const TRANSITIONS = {
  pending_confirmation: ['accepted'],
  accepted: ['preparing'],
  preparing: ['ready_for_pickup', 'out_for_delivery'],
  ready_for_pickup: ['completed'],
  out_for_delivery: ['completed'],
};

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

export async function transitionOrderStatus({ db, actorUid, payload }) {
  if (!actorUid) fail('unauthenticated', 'Sign in with an authorized staff account.');
  if (!payload || typeof payload !== 'object'
    || typeof payload.orderId !== 'string' || !/^[A-Za-z0-9_-]{10,128}$/.test(payload.orderId)
    || typeof payload.toStatus !== 'string') {
    fail('invalid-argument', 'Invalid order status request.');
  }
  if (payload.reason != null && (typeof payload.reason !== 'string' || payload.reason.length > 250)) {
    fail('invalid-argument', 'The status note must be 250 characters or fewer.');
  }

  const staffRef = db.collection('staff').doc(actorUid);
  const orderRef = db.collection('orders').doc(payload.orderId);

  return db.runTransaction(async (transaction) => {
    const staffSnapshot = await transaction.get(staffRef);
    if (!staffSnapshot.exists || staffSnapshot.data().active !== true
      || !['staff', 'admin'].includes(staffSnapshot.data().role)) {
      fail('permission-denied', 'You do not have permission to manage restaurant orders.');
    }
    const orderSnapshot = await transaction.get(orderRef);
    if (!orderSnapshot.exists) fail('not-found', 'This order could not be found.');
    const order = orderSnapshot.data();
    if (!['delivery', 'pickup'].includes(order.fulfilmentType)
      || !['COD', 'COP'].includes(order.paymentMethod)
      || (order.fulfilmentType === 'delivery' && order.paymentMethod !== 'COD')
      || (order.fulfilmentType === 'pickup' && order.paymentMethod !== 'COP')) {
      fail('failed-precondition', 'This order has an invalid fulfilment or payment configuration.');
    }

    if (order.status === payload.toStatus) {
      if (payload.toStatus === 'completed' && order.paymentStatus !== 'paid') {
        fail('failed-precondition', 'The completed order has an inconsistent payment state.');
      }
      return { orderId: payload.orderId, replayed: true };
    }
    const allowed = TRANSITIONS[order.status] || [];
    if (!allowed.includes(payload.toStatus)) {
      fail('failed-precondition', 'This order cannot move to the selected status.');
    }
    if (order.fulfilmentType === 'pickup' && payload.toStatus === 'out_for_delivery') {
      fail('failed-precondition', 'Pickup orders cannot be marked out for delivery.');
    }
    if (order.fulfilmentType === 'delivery' && payload.toStatus === 'ready_for_pickup') {
      fail('failed-precondition', 'Delivery orders cannot be marked ready for pickup.');
    }

    const completing = payload.toStatus === 'completed';
    if (completing && payload.cashCollected !== true) {
      fail('failed-precondition', 'Confirm that cash was collected before completing this order.');
    }
    if (completing && order.paymentStatus !== 'unpaid') {
      fail('failed-precondition', 'This order payment has already been recorded.');
    }

    const now = FieldValue.serverTimestamp();
    transaction.update(orderRef, {
      status: payload.toStatus,
      ...(completing ? { paymentStatus: 'paid', paidAt: now } : {}),
      updatedAt: now,
    });
    transaction.create(orderRef.collection('events').doc(), {
      type: 'status_changed',
      fromStatus: order.status,
      toStatus: payload.toStatus,
      actorUid,
      actorRole: staffSnapshot.data().role,
      reason: payload.reason?.trim() || null,
      ...(completing ? { paymentStatus: 'paid', cashCollected: true } : {}),
      createdAt: now,
    });
    return { orderId: payload.orderId, replayed: false };
  });
}
