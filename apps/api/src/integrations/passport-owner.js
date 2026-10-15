const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export class PrivateLinkError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}

// getUser validates the token first. Decoding afterwards only extracts its session binding.
export async function authenticateOwner(header, clientFactory) {
  const match = /^Bearer ([A-Za-z0-9_.-]{32,8192})$/.exec(header || '');
  if (!match) throw new PrivateLinkError('sign_in_required', 401);
  const token = match[1];
  const client = clientFactory(token);
  const { data, error } = await client.auth.getUser(token);
  if (error || !UUID.test(data?.user?.id || '')) throw new PrivateLinkError('sign_in_required', 401);
  let claims;
  try { claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')); }
  catch { throw new PrivateLinkError('sign_in_required', 401); }
  if (claims.sub !== data.user.id || !UUID.test(claims.session_id || '')
    || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) {
    throw new PrivateLinkError('sign_in_required', 401);
  }
  const result = await client.from('gaming_passports').select('id,status,slug,publication_consent')
    .eq('owner_id', data.user.id).maybeSingle();
  if (result.error || !result.data) throw new PrivateLinkError('passport_required', 409);
  if (result.data.status !== 'draft_private' || result.data.slug !== null || result.data.publication_consent !== false) {
    throw new PrivateLinkError('private_passport_required', 409);
  }
  return { ownerId: data.user.id, sessionId: claims.session_id, passportId: result.data.id, client };
}
