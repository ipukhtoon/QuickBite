import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCustomerProfile } from '../src/profile-model.js';

test('profile model copies only trusted Firebase Auth identity fields', () => {
  const result = buildCustomerProfile({
    uid: 'auth-user-id',
    displayName: '  QuickBite Customer  ',
    email: ' CUSTOMER@EXAMPLE.COM ',
    phoneNumber: '+000000000',
    customClaims: { role: 'admin' },
  });

  assert.deepEqual(result, {
    displayName: 'QuickBite Customer',
    email: 'customer@example.com',
  });
  assert.equal(Object.hasOwn(result, 'uid'), false);
  assert.equal(Object.hasOwn(result, 'phoneNumber'), false);
  assert.equal(Object.hasOwn(result, 'role'), false);
});

test('profile model safely handles absent Auth profile fields', () => {
  assert.deepEqual(buildCustomerProfile({ uid: 'auth-user-id' }), {
    displayName: null,
    email: null,
  });
});

test('profile model bounds the display name', () => {
  const result = buildCustomerProfile({
    displayName: 'A'.repeat(200),
    email: 'a@example.com',
  });
  assert.equal(result.displayName.length, 80);
});
