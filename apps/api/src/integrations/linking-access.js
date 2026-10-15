const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Public linking is an explicit server setting, independent of profile publication.
export function readLinkingAccess(env, provider) {
  const access = env[provider + '_LINKING_ACCESS'] || 'testers';
  if (!['testers', 'public'].includes(access)) throw new Error('invalid_linking_access');
  const testers = (env[provider + '_TESTER_IDS'] || '').split(',').map((id) => id.trim()).filter(Boolean);
  if (testers.length > 10 || testers.some((id) => !UUID.test(id))
    || (access === 'testers' && !testers.length)) throw new Error('invalid_linking_testers');
  return { access, testers: new Set(testers) };
}

export function canLink(config, ownerId) {
  return UUID.test(ownerId || '') && (config.access === 'public' || config.testers?.has(ownerId) === true);
}
