import { readSupabaseConfig } from './config.js';

let cachedClient;
let cachedConfig;

export function createSupabaseClientFromFactory(factory, config = readSupabaseConfig()) {
  if (!config.isConfigured) return null;

  return factory(config.url, config.publishableKey, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

export async function getSupabaseRuntime({ factory, config: configOverride } = {}) {
  if (cachedConfig) {
    return { client: cachedClient, config: cachedConfig };
  }

  cachedConfig = configOverride || readSupabaseConfig();
  cachedClient = null;

  if (!cachedConfig.isConfigured) {
    return { client: cachedClient, config: cachedConfig };
  }

  try {
    const createClient = factory || (await import('@supabase/supabase-js')).createClient;
    cachedClient = createSupabaseClientFromFactory(createClient, cachedConfig);
  } catch {
    cachedConfig = {
      ...cachedConfig,
      isConfigured: false,
      reason: 'Supabase client could not be initialized safely.',
    };
    cachedClient = null;
  }

  return { client: cachedClient, config: cachedConfig };
}

export function resetSupabaseRuntimeForTests() {
  cachedClient = undefined;
  cachedConfig = undefined;
}
