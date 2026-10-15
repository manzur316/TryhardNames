import { readSupabaseConfig } from './config.js';

let runtimePromise;

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
  if (!runtimePromise) {
    runtimePromise = initializeSupabaseRuntime(factory, configOverride || readSupabaseConfig());
  }
  return runtimePromise;
}

async function initializeSupabaseRuntime(factory, config) {
  if (!config.isConfigured) {
    return { client: null, config };
  }

  try {
    const createClient = factory || (await import('@supabase/supabase-js')).createClient;
    const client = createSupabaseClientFromFactory(createClient, config);
    return { client, config };
  } catch {
    return {
      client: null,
      config: {
        ...config,
        isConfigured: false,
        reason: 'Supabase client could not be initialized safely.',
      },
    };
  }
}

export function resetSupabaseRuntimeForTests() {
  runtimePromise = undefined;
}
