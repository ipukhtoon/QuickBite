import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.GCLOUD_PROJECT || 'demo-quickbite';
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
const functionsHost = '127.0.0.1:5001';
let adminAuth;
let db;
let uid;
let idToken;
let email;

async function callEnsureProfile(token) {
  return fetch(`http://${functionsHost}/${projectId}/us-central1/ensureCustomerProfile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ data: {} }),
  });
}

before(async () => {
  assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST, 'Auth Emulator must be started for this test.');
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'Firestore Emulator must be started for this test.');
  const app = getApps().find((item) => item.name === '[DEFAULT]')
    || initializeApp({ projectId });
  adminAuth = getAuth(app);
  db = getFirestore(app);

  email = `quickbite-test-${Date.now()}@example.test`;
  const signup = await fetch(
    `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'QuickBite-Test-Password-123!',
        returnSecureToken: true,
      }),
    },
  );
  assert.equal(signup.ok, true, 'Auth Emulator should create a synthetic test user.');
  const user = await signup.json();
  uid = user.localId;
  idToken = user.idToken;

  const update = await fetch(
    `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:update?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken,
        displayName: 'QuickBite Test Customer',
        returnSecureToken: true,
      }),
    },
  );
  assert.equal(update.ok, true, 'Auth Emulator should update the synthetic user display name.');
  const updatedUser = await update.json();
  assert.ok(typeof updatedUser.idToken === 'string' && updatedUser.idToken.length > 0, 'Auth Emulator should return a refreshed ID token.');
  idToken = updatedUser.idToken;
});

after(async () => {
  if (uid && adminAuth) {
    try { await adminAuth.deleteUser(uid); } catch { /* emulator cleanup is best-effort */ }
  }
});

test('customer profile callable requires an authenticated Firebase user', async () => {
  const response = await callEnsureProfile(null);
  assert.equal(response.status, 401);
});

test('authenticated user gets a trusted customer profile and repeat calls preserve existing fields', async () => {
  const response = await callEnsureProfile(idToken);
  const responseBody = await response.json();
  assert.equal(response.ok, true, `Callable should succeed for a valid Auth Emulator token; status=${response.status}, body=${JSON.stringify(responseBody)}`);
  const profileRef = db.collection('customers').doc(uid);
  const first = await profileRef.get();
  assert.equal(first.exists, true);
  assert.equal(first.get('displayName'), 'QuickBite Test Customer');
  assert.equal(first.get('email'), email.toLowerCase());
  assert.ok(first.get('createdAt'));
  assert.ok(first.get('updatedAt'));

  await profileRef.set({ phone: '+10000000000' }, { merge: true });
  const createdAt = (await profileRef.get()).get('createdAt');

  const retry = await callEnsureProfile(idToken);
  assert.equal(retry.ok, true);
  const second = await profileRef.get();
  assert.equal(second.get('phone'), '+10000000000');
  assert.equal(second.get('createdAt').toMillis(), createdAt.toMillis());
  assert.equal(second.get('displayName'), 'QuickBite Test Customer');
});
