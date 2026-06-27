alter table public.linked_provider_accounts
  drop constraint linked_provider_accounts_provider_check,
  add constraint linked_provider_accounts_provider_check
    check (provider in ('discord', 'osu', 'riot'));

alter table public.verified_proofs
  drop constraint verified_proofs_provider_check,
  add constraint verified_proofs_provider_check
    check (provider in ('discord', 'osu', 'riot'));

alter table public.provider_connection_intents
  drop constraint provider_connection_intents_provider_check,
  drop constraint provider_connection_intents_no_live_scopes,
  add constraint provider_connection_intents_provider_check
    check (provider in ('discord', 'osu', 'riot')),
  add constraint provider_connection_intents_scope_allowlist check (
    (
      provider <> 'osu'
      and coalesce(array_length(requested_scopes, 1), 0) = 0
    )
    or (
      provider = 'osu'
      and coalesce(array_length(requested_scopes, 1), 0) between 1 and 2
      and requested_scopes <@ array['identify', 'public']::text[]
    )
  );

alter table public.provider_callback_states
  drop constraint provider_callback_states_provider_check,
  add constraint provider_callback_states_provider_check
    check (provider in ('discord', 'osu', 'riot'));

alter table public.provider_token_vault
  drop constraint provider_token_vault_provider_check,
  add constraint provider_token_vault_provider_check
    check (provider in ('discord', 'osu', 'riot'));

alter table public.provider_sync_jobs
  drop constraint provider_sync_jobs_provider_check,
  add constraint provider_sync_jobs_provider_check
    check (provider in ('discord', 'osu', 'riot'));

alter table public.provider_audit_events
  drop constraint provider_audit_events_provider_check,
  add constraint provider_audit_events_provider_check
    check (provider in ('discord', 'osu', 'riot'));

-- RM-27 intentionally preserves the PR16 token vault lock:
-- provider_token_vault_no_ciphertext_in_pr16 keeps token_ciphertext null.
-- The osu! foundation uses no-refresh-token storage and immediate revoke.
