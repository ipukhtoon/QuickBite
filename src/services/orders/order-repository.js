import {
  collection,
  limit,
  orderBy,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { getFirebaseServices } from '../firebase/client.js';

export async function fetchMyOrders(maximum = 20) {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase is not configured for this environment.');
  const user = services.auth.currentUser;
  if (!user) {
    const error = new Error('Sign in to view your orders.');
    error.code = 'auth-required';
    throw error;
  }

  const result = await getDocs(query(
    collection(services.db, 'orders'),
    where('customerUid', '==', user.uid),
    orderBy('createdAt', 'desc'),
    limit(Math.min(50, Math.max(1, maximum))),
  ));

  return result.docs.map((snapshot) => ({
    id: snapshot.id,
    ...snapshot.data(),
  }));
}
