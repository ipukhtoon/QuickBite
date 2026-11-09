import {
  collection,
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

export async function fetchActiveCategories() {
  const db = databaseOrThrow();
  const result = await getDocs(query(collection(db, 'categories'), where('active', '==', true), orderBy('sortOrder', 'asc')));
  return result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
}

export async function fetchActiveProducts({ categoryId } = {}) {
  const db = databaseOrThrow();
  const constraints = [where('active', '==', true)];
  if (categoryId) constraints.push(where('categoryId', '==', categoryId));
  constraints.push(orderBy('sortOrder', 'asc'));
  const result = await getDocs(query(collection(db, 'products'), ...constraints));
  return result.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
}
