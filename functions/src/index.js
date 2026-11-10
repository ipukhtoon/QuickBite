import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { buildCustomerProfile } from './profile-model.js';
import { createCustomerOrder } from './order-service.js';
import { transitionOrderStatus } from './order-workflow.js';

if (!getApps().length) initializeApp();

export const ensureCustomerProfile = onCall(async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in before setting up your customer profile.');
  }

  try {
    const user = await getAuth().getUser(request.auth.uid);
    const profileRef = getFirestore().collection('customers').doc(request.auth.uid);
    const existing = await profileRef.get();
    const profile = {
      ...buildCustomerProfile(user),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (!existing.exists) profile.createdAt = FieldValue.serverTimestamp();
    await profileRef.set(profile, { merge: true });

    return { ok: true };
  } catch (error) {
    logger.error('Customer profile provisioning failed.', {
      code: error?.code || 'unknown',
    });
    throw new HttpsError('internal', 'Your account is signed in, but profile setup could not be completed.');
  }
});

export const createOrder = onCall(async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in before placing an order.');
  }

  try {
    const authUser = await getAuth().getUser(request.auth.uid);
    const result = await createCustomerOrder({
      db: getFirestore(),
      uid: request.auth.uid,
      authUser,
      payload: request.data,
    });
    return { ok: true, ...result };
  } catch (error) {
    const allowedCodes = new Set([
      'invalid-argument',
      'failed-precondition',
      'already-exists',
      'unauthenticated',
    ]);
    if (allowedCodes.has(error?.code)) {
      throw new HttpsError(error.code, error.message);
    }
    logger.error('Customer order creation failed.', {
      code: error?.code || 'unknown',
    });
    throw new HttpsError('internal', 'We could not place your order. Please retry safely.');
  }
});

export const transitionOrder = onCall(async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in with an authorized staff account.');
  }

  try {
    const result = await transitionOrderStatus({
      db: getFirestore(),
      actorUid: request.auth.uid,
      payload: request.data,
    });
    return { ok: true, ...result };
  } catch (error) {
    const allowedCodes = new Set([
      'invalid-argument',
      'failed-precondition',
      'permission-denied',
      'not-found',
      'unauthenticated',
    ]);
    if (allowedCodes.has(error?.code)) {
      throw new HttpsError(error.code, error.message);
    }
    logger.error('Order status transition failed.', {
      code: error?.code || 'unknown',
    });
    throw new HttpsError('internal', 'We could not update this order. Please refresh and try again.');
  }
});
