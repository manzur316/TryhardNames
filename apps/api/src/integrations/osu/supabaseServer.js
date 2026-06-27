import { createClient } from '@supabase/supabase-js';

let cachedClient = null;
let cachedKey = '';

export function getSupabaseAdminClient(config) {
  const cacheKey = `${config.supabaseUrl}:${config.supabaseServiceRoleKey}`;
  if (cachedClient && cachedKey === cacheKey) return cachedClient;

  cachedClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  cachedKey = cacheKey;
  return cachedClient;
}

export async function requireOwnerSession(req, supabase) {
  const token = getBearerToken(req);
  if (!token) {
    const error = new Error('missing_auth');
    error.status = 401;
    throw error;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user?.id) {
    const authError = new Error('invalid_auth');
    authError.status = 401;
    throw authError;
  }

  return {
    ownerId: data.user.id,
  };
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(/\s+/);
  if (!/^Bearer$/i.test(type || '') || !token) return '';
  return token.trim();
}
