export function applySignedOutSessionState(result, currentState) {
  if (!result?.ok) return currentState;
  return { user: null, session: null };
}
