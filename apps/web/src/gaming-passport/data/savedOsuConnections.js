const COLUMNS = 'id,owner_id,passport_id,provider,external_account_id,status,visibility,verified_at,last_synced_at,revoked_at,metadata_safe';

// Owner-only reads use the existing RLS policies, never a privileged browser client.
export async function getSavedOsuConnections(client, session, passportId, signal) {
  const ownerId = session?.user?.id;
  if (!client || !session?.access_token || !ownerId || !passportId) throw new Error('sign_in_required');
  const { data, error } = await client.from('linked_provider_accounts').select(COLUMNS)
    .eq('owner_id', ownerId).eq('passport_id', passportId).eq('provider', 'osu')
    .eq('visibility', 'private').in('status', ['verified', 'stale']).is('revoked_at', null)
    .order('last_synced_at', { ascending: false }).abortSignal(signal);
  if (error) throw error;
  return (data || []).filter((row) => row.owner_id === ownerId && row.passport_id === passportId)
    .map((row) => mapSavedOsuConnection(row)).filter(Boolean);
}

export function mapSavedOsuConnection(row, now = Date.now()) {
  const snapshot = row?.metadata_safe?.snapshot;
  if (!row?.id || row.provider !== 'osu' || row.visibility !== 'private' || row.revoked_at
    || !['verified', 'stale'].includes(row.status) || row.metadata_safe?.normalizerVersion !== 'osu.private.v1'
    || !snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)
    || !/^[1-9][0-9]{0,15}$/.test(row.external_account_id || '')
    || !Number.isFinite(Date.parse(row.verified_at))) return null;
  const syncedAt = Date.parse(row.last_synced_at);
  return {
    id: row.id, provider: 'osu', username: snapshot.username, mode: snapshot.mode,
    avatarUrl: `https://a.ppy.sh/${row.external_account_id}`,
    pp: snapshot.pp, globalRank: snapshot.globalRank, countryRank: snapshot.countryRank,
    accuracyPercent: snapshot.accuracyPercent, medals: snapshot.medals,
    verifiedAt: row.verified_at, lastSyncedAt: row.last_synced_at,
    status: !Number.isFinite(syncedAt) || now - syncedAt >= 86_400_000 ? 'stale' : row.status,
    visibility: 'private', persisted: true,
  };
}
