import { mapPassportRow } from './passportRepository.js';
import { isCanonicalPublicSlug, normalizePublicSlug } from '../domain/contracts.js';

export async function managePassportPublication(client, session, passportId, options = {}) {
  if (!client || !session?.user?.id || !passportId) throw new Error('sign_in_required');
  const action = options.action || 'inspect';
  const slug = normalizePublicSlug(options.slug);
  if (action === 'publish' && (!options.consent || !isCanonicalPublicSlug(slug))) {
    throw new Error('invalid_publication');
  }
  const { data, error } = await client.rpc('manage_passport_publication', {
    p_passport: passportId, p_action: action, p_slug: slug || null,
    p_accounts: (options.accounts || []).filter((item) => item.selected).map((item) => ({
      accountId: item.id, showStats: item.provider === 'osu' && item.showStats === true,
    })),
    p_consent: options.consent === true, p_expected_updated_at: options.updatedAt || null,
  });
  if (error) throw error;
  if (data?.passport?.owner_id !== session.user.id || data.passport.id !== passportId) throw new Error('invalid_response');
  return { passport: mapPassportRow(data.passport), accounts: data.accounts || [] };
}

export function publicationError(error) {
  if (error?.code === '23505') return 'That public address is unavailable. Choose another one.';
  if (error?.message?.includes('passport_changed')) return 'Your Passport changed in another tab. Reload before publishing.';
  if (error?.message?.includes('verified_account_required')) return 'Link and verify a game account first.';
  if (error?.message?.includes('invalid_selection')) return 'A selected account changed. Close this window and try again.';
  if (error?.message?.includes('sign_in_required') || error?.code === '42501') return 'Check your session and account permissions, then try again.';
  return 'Could not update publication. Your profile visibility has not been confirmed; retry to check its current state.';
}
