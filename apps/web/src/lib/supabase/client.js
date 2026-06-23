import { createClient } from '@supabase/supabase-js';
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
      detectSessionInUrl: true,
    },
  });
}

export function getSupabaseRuntime() {
  if (cachedConfig) {
    return { client: cachedClient, config: cachedConfig };
  }

  cachedConfig = readSupabaseConfig();
  cachedClient = createSupabaseClientFromFactory(createClient, cachedConfig);
  return { client: cachedClient, config: cachedConfig };
}

export function resetSupabaseRuntimeForTests() {
  cachedClient = undefined;
  cachedConfig = undefined;
}
