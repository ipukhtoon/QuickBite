import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { getBytes, ref, uploadBytes } from 'firebase/storage';

let testEnv;
const menuPath = 'menu/security-test.txt';

before(async () => {
  const rules = await readFile('storage.rules', 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-quickbite',
    storage: { rules },
  });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await uploadBytes(ref(context.storage(), menuPath), new Uint8Array([81, 66]));
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test('public users can read published menu media', async () => {
  const storage = testEnv.unauthenticatedContext().storage();
  const bytes = await assertSucceeds(getBytes(ref(storage, menuPath)));
  assert.deepEqual([...new Uint8Array(bytes)], [81, 66]);
});

test('public users cannot upload menu media', async () => {
  const storage = testEnv.unauthenticatedContext().storage();
  await assertFails(uploadBytes(ref(storage, 'menu/attacker.txt'), new Uint8Array([1])));
});

test('customers cannot upload menu media or access private storage paths', async () => {
  const storage = testEnv.authenticatedContext('customer-a').storage();
  await assertFails(uploadBytes(ref(storage, 'menu/customer-upload.txt'), new Uint8Array([1])));
  await assertFails(getBytes(ref(storage, 'private/customer-a.txt')));
});
