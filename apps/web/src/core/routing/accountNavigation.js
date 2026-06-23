export function getAccountNavigationState({ isConfigured, session }) {
  if (!isConfigured) return null;
  return session
    ? { href: '/account', label: 'Account' }
    : { href: '/sign-in', label: 'Sign in' };
}
