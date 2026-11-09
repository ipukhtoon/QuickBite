import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { getFirebaseServices } from './client.js';

function authOrThrow() {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase is not configured for this environment.');
  return services.auth;
}

export async function registerCustomer({ email, password, displayName }) {
  const auth = authOrThrow();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName?.trim()) await updateProfile(credential.user, { displayName: displayName.trim() });
  return credential.user;
}

export async function signInCustomer({ email, password }) {
  return (await signInWithEmailAndPassword(authOrThrow(), email.trim(), password)).user;
}

export function signOutCustomer() {
  return signOut(authOrThrow());
}

export function sendCustomerPasswordReset(email) {
  return sendPasswordResetEmail(authOrThrow(), email.trim());
}

export function observeAuthState(callback, onError) {
  return onAuthStateChanged(authOrThrow(), callback, onError);
}

export async function ensureCustomerProfile() {
  const services = getFirebaseServices();
  if (!services) throw new Error('Firebase is not configured for this environment.');
  const ensureProfile = httpsCallable(services.functions, 'ensureCustomerProfile');
  return ensureProfile({});
}
