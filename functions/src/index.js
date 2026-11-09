import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { buildCustomerProfile } from './profile-model.js';

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
