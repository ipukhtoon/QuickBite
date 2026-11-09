export function buildCustomerProfile(authUser) {
  const displayName = typeof authUser?.displayName === 'string' && authUser.displayName.trim()
    ? authUser.displayName.trim().slice(0, 80)
    : null;
  const email = typeof authUser?.email === 'string' && authUser.email.trim()
    ? authUser.email.trim().toLowerCase()
    : null;

  return { displayName, email };
}
