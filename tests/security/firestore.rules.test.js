import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

let testEnv;

before(async () => {
  const rules = await readFile('firestore.rules', 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-quickbite',
    firestore: { rules },
  });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'settings/public'), {
      displayName: 'Demo Restaurant',
      currencyCode: 'TEST',
    });
    await setDoc(doc(db, 'categories/active-category'), {
      name: 'Active category', active: true, sortOrder: 1,
    });
    await setDoc(doc(db, 'products/active-product'), {
      name: 'Active product', active: true, sortOrder: 1, categoryId: 'active-category',
    });
    await setDoc(doc(db, 'products/inactive-product'), {
      name: 'Inactive product', active: false, sortOrder: 2, categoryId: 'active-category',
    });
    await setDoc(doc(db, 'optionGroups/active-size'), {
      name: 'Size', active: true, selectionType: 'single', required: true, minSelections: 1, maxSelections: 1,
    });
    await setDoc(doc(db, 'optionGroups/active-size/options/regular'), {
      name: 'Regular', active: true, priceDeltaMinor: 0, sortOrder: 1,
    });
    await setDoc(doc(db, 'optionGroups/active-size/options/hidden'), {
      name: 'Hidden', active: false, priceDeltaMinor: 100, sortOrder: 2,
    });
    await setDoc(doc(db, 'optionGroups/inactive-size'), {
      name: 'Inactive size', active: false, selectionType: 'single',
    });
    await setDoc(doc(db, 'optionGroups/inactive-size/options/regular'), {
      name: 'Regular', active: true, priceDeltaMinor: 0, sortOrder: 1,
    });
    await setDoc(doc(db, 'customers/customer-a'), { displayName: 'Customer A' });
    await setDoc(doc(db, 'customers/customer-b'), { displayName: 'Customer B' });
    await setDoc(doc(db, 'orders/order-a'), {
      customerUid: 'customer-a', status: 'pending_confirmation',
    });
    await setDoc(doc(db, 'orders/order-b'), {
      customerUid: 'customer-b', status: 'pending_confirmation',
    });
    await setDoc(doc(db, 'staff/staff-active'), {
      role: 'staff', active: true,
    });
    await setDoc(doc(db, 'staff/staff-inactive'), {
      role: 'staff', active: false,
    });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test('public users can read public settings and active catalogue records', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, 'settings/public')));
  await assertSucceeds(getDoc(doc(db, 'products/active-product')));
  await assertSucceeds(getDoc(doc(db, 'categories/active-category')));
  await assertSucceeds(getDocs(query(
    collection(db, 'products'),
    where('active', '==', true),
    orderBy('sortOrder', 'asc'),
  )));
});

test('public users cannot read inactive products or write catalogue records', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, 'products/inactive-product')));
  await assertFails(setDoc(doc(db, 'products/attacker-product'), {
    name: 'Injected', active: true, sortOrder: 0,
  }));
});

test('public users can read only active product option groups and choices', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, 'optionGroups/active-size')));
  await assertSucceeds(getDoc(doc(db, 'optionGroups/active-size/options/regular')));
  await assertSucceeds(getDocs(query(
    collection(db, 'optionGroups/active-size/options'),
    where('active', '==', true),
    orderBy('sortOrder', 'asc'),
  )));
  await assertFails(getDoc(doc(db, 'optionGroups/active-size/options/hidden')));
  await assertFails(getDoc(doc(db, 'optionGroups/inactive-size')));
  await assertFails(getDoc(doc(db, 'optionGroups/inactive-size/options/regular')));
  await assertFails(setDoc(doc(db, 'optionGroups/active-size/options/injected'), {
    name: 'Injected', active: true, priceDeltaMinor: 0,
  }));
});

test('customers can read only their own customer record', async () => {
  const db = testEnv.authenticatedContext('customer-a').firestore();
  await assertSucceeds(getDoc(doc(db, 'customers/customer-a')));
  await assertFails(getDoc(doc(db, 'customers/customer-b')));
  await assertFails(setDoc(doc(db, 'customers/customer-a'), {
    displayName: 'Privilege escalation attempt',
  }));
});

test('customers can query only their own orders and cannot write orders', async () => {
  const db = testEnv.authenticatedContext('customer-a').firestore();
  await assertSucceeds(getDoc(doc(db, 'orders/order-a')));
  await assertFails(getDoc(doc(db, 'orders/order-b')));
  await assertSucceeds(getDocs(query(
    collection(db, 'orders'),
    where('customerUid', '==', 'customer-a'),
  )));
  await assertFails(setDoc(doc(db, 'orders/fake-order'), {
    customerUid: 'customer-a', status: 'accepted',
  }));
});

test('guest users cannot directly read or create orders', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, 'orders/order-a')));
  await assertFails(setDoc(doc(db, 'orders/guest-order'), {
    status: 'pending_confirmation',
  }));
});

test('active staff can read orders while inactive staff cannot', async () => {
  const activeDb = testEnv.authenticatedContext('staff-active').firestore();
  const inactiveDb = testEnv.authenticatedContext('staff-inactive').firestore();
  await assertSucceeds(getDoc(doc(activeDb, 'orders/order-a')));
  await assertSucceeds(getDoc(doc(activeDb, 'orders/order-b')));
  await assertFails(getDoc(doc(inactiveDb, 'orders/order-a')));
});

test('customers can create and delete only their own saved-item records', async () => {
  const db = testEnv.authenticatedContext('customer-a').firestore();
  const savedItem = doc(db, 'savedItems/customer-a/items/active-product');
  await assertSucceeds(setDoc(savedItem, {
    productId: 'active-product',
    createdAt: serverTimestamp(),
  }));
  await assertSucceeds(getDoc(savedItem));
  await assertSucceeds(deleteDoc(savedItem));
  await assertFails(getDoc(doc(db, 'savedItems/customer-b/items/active-product')));
});
