import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteApp, initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { getApps, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.GCLOUD_PROJECT || 'demo-quickbite';
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
let webApp;
let auth;
let functions;
let adminAuth;
let db;
let user;

before(async () => {
  assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST, 'Auth Emulator must be started for this test.');
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'Firestore Emulator must be started for this test.');

  webApp = initializeApp({
    apiKey: 'fake-api-key',
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    appId: '1:123456789:web:quickbite-test',
  }, 'quickbite-profile-integration-test');

  auth = getAuth(webApp);
  connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });
  functions = getFunctions(webApp);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);

  const adminApp = getApps().find((item) => item.name === '[DEFAULT]')
    || initializeAdminApp({ projectId });
  adminAuth = getAdminAuth(adminApp);
  db = getFirestore(adminApp);
});

after(async () => {
  if (auth?.currentUser) {
    try { await deleteUser(auth.currentUser); } catch { /* emulator cleanup is best-effort */ }
  }
  if (webApp) await deleteApp(webApp);
});

test('customer profile callable requires an authenticated Firebase user', async () => {
  const ensureProfile = httpsCallable(functions, 'ensureCustomerProfile');
  await assert.rejects(
    ensureProfile({}),
    (error) => error?.code === 'functions/unauthenticated',
  );
});

test('authenticated user gets a trusted customer profile and repeat calls preserve existing fields', async () => {
  const email = `quickbite-test-${Date.now()}@example.test`;
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    'QuickBite-Test-Password-123!',
  );
  user = credential.user;
  await updateProfile(user, { displayName: 'QuickBite Test Customer' });

  const ensureProfile = httpsCallable(functions, 'ensureCustomerProfile');
  const result = await ensureProfile({});
  assert.equal(result.data.ok, true);

  const profileRef = db.collection('customers').doc(user.uid);
  const first = await profileRef.get();
  assert.equal(first.exists, true);
  assert.equal(first.get('displayName'), 'QuickBite Test Customer');
  assert.equal(first.get('email'), email.toLowerCase());
  assert.ok(first.get('createdAt'));
  assert.ok(first.get('updatedAt'));

  await profileRef.set({ phone: '+10000000000' }, { merge: true });
  const createdAt = (await profileRef.get()).get('createdAt');

  const retry = await ensureProfile({});
  assert.equal(retry.data.ok, true);
  const second = await profileRef.get();
  assert.equal(second.get('phone'), '+10000000000');
  assert.equal(second.get('createdAt').toMillis(), createdAt.toMillis());
  assert.equal(second.get('displayName'), 'QuickBite Test Customer');
});

test('trusted order callable rejects unauthenticated requests', async () => {
  const createOrder = httpsCallable(functions, 'createOrder');
  await assert.rejects(
    createOrder({}),
    (error) => error?.code === 'functions/unauthenticated',
  );
});

test('authenticated order callable fails closed until restaurant ordering is configured', async () => {
  const createOrder = httpsCallable(functions, 'createOrder');
  await assert.rejects(
    createOrder({
      idempotencyKey: 'emulator-order-submission-key-123456',
      items: [{
        productId: 'missing-product',
        quantity: 1,
        selections: [],
      }],
      fulfilmentType: 'pickup',
      paymentMethod: 'COP',
      customer: { name: 'Emulator Test', phone: '+10000000000' },
    }),
    (error) => error?.code === 'functions/failed-precondition',
  );
});

test('ordinary authenticated customers cannot invoke staff order transitions', async () => {
  const transitionOrder = httpsCallable(functions, 'transitionOrder');
  await assert.rejects(
    transitionOrder({
      orderId: 'order-id-1234567890',
      toStatus: 'accepted',
    }),
    (error) => error?.code === 'functions/permission-denied',
  );
});
