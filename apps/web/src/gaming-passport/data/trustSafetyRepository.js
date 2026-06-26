import { validatePublicProfileReportInput } from '@/gaming-passport/trust-safety/index.js';

export async function submitPublicProfileReport(client, input = {}) {
  const validation = validatePublicProfileReportInput(input);
  if (!validation.ok) {
    return { ok: false, error: 'invalid_report', validation };
  }
  if (!client) {
    return { ok: false, error: 'report_unavailable' };
  }

  try {
    const { data, error } = await client.rpc('submit_public_profile_report', {
      public_slug: validation.value.slug,
      report_category: validation.value.category,
      report_details: validation.value.details,
    });

    if (error) return { ok: false, error: 'report_failed' };
    if (data?.ok === true) return { ok: true };
    return { ok: false, error: data?.error || 'invalid_report' };
  } catch {
    return { ok: false, error: 'report_failed' };
  }
}
