import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { getFirebaseServices } from '../firebase/client.js';

function databaseOrThrow() {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase is not configured for this environment.');
  return services.db;
}

export async function fetchPublicSettings() {
  const db = databaseOrThrow();
  const snapshot = await getDoc(doc(db, 'settings/public'));
  if (!snapshot.exists()) throw new Error('Public restaurant settings have not been configured.');
  const settings = snapshot.data();
  if (typeof settings.currencyCode !== 'string' || !/^[A-Z]{3}$/.test(settings.currencyCode)) {
    throw new Error('The restaurant currency has not been configured correctly.');
  }
  return settings;
}

export async function fetchActiveCategories() {
  const db = databaseOrThrow();
  const result = await getDocs(query(
    collection(db, 'categories'),
    where('active', '==', true),
    orderBy('sortOrder', 'asc'),
  ));
  return result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
}

async function fetchOptionGroups(db, groupIds = []) {
  const uniqueIds = [...new Set(groupIds)].filter((id) => typeof id === 'string' && id.length > 0);
  return Promise.all(uniqueIds.map(async (groupId) => {
    const groupSnapshot = await getDoc(doc(db, 'optionGroups', groupId));
    if (!groupSnapshot.exists()) return null;
    const group = groupSnapshot.data();
    if (group.active !== true) return null;
    const optionsSnapshot = await getDocs(query(
      collection(db, 'optionGroups', groupId, 'options'),
      where('active', '==', true),
      orderBy('sortOrder', 'asc'),
    ));
    return {
      id: groupSnapshot.id,
      name: group.name,
      type: group.selectionType,
      required: group.required === true,
      min: Number.isInteger(group.minSelections) ? group.minSelections : (group.required ? 1 : 0),
      max: Number.isInteger(group.maxSelections) ? group.maxSelections : 1,
      choices: optionsSnapshot.docs.map((optionSnapshot) => {
        const option = optionSnapshot.data();
        return {
          id: optionSnapshot.id,
          label: option.name,
          deltaMinor: Number.isInteger(option.priceDeltaMinor) ? option.priceDeltaMinor : 0,
        };
      }),
    };
  })).then((groups) => groups.filter((group) => group && group.choices.length > 0));
}

export async function fetchActiveProducts({ categoryId } = {}) {
  const db = databaseOrThrow();
  const constraints = [where('active', '==', true)];
  if (categoryId) constraints.push(where('categoryId', '==', categoryId));
  constraints.push(orderBy('sortOrder', 'asc'));
  const result = await getDocs(query(collection(db, 'products'), ...constraints));
  return Promise.all(result.docs.map(async (snapshot) => {
    const product = snapshot.data();
    return {
      id: snapshot.id,
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || '',
      priceMinor: product.priceMinor,
      available: product.available !== false,
      optionGroups: await fetchOptionGroups(db, product.optionGroupIds || []),
    };
  }));
}
