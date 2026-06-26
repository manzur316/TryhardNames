create table public.provider_connection_intents (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  passport_id uuid not null,
  provider text not null,
  status text not null default 'pending',
  state_hash text not null,
  requested_scopes text[] not null default '{}'::text[],
  redirect_path text null,
  expires_at timestamptz not null,
  consumed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_connection_intents_passport_owner_fk foreign key (passport_id, owner_id)
    references public.gaming_passports (id, owner_id)
    on delete cascade,
  constraint provider_connection_intents_provider_state_uid unique (provider, state_hash),
  constraint provider_connection_intents_provider_check check (provider in ('discord', 'riot')),
  constraint provider_connection_intents_status_check check (
    status in ('pending', 'consumed', 'expired', 'cancelled')
  ),
  constraint provider_connection_intents_state_hash_length check (
    state_hash = btrim(state_hash)
    and char_length(state_hash) between 16 and 256
  ),
  constraint provider_connection_intents_redirect_path_length check (
    redirect_path is null or char_length(redirect_path) <= 256
  ),
  constraint provider_connection_intents_no_live_scopes check (
    coalesce(array_length(requested_scopes, 1), 0) = 0
  ),
  constraint provider_connection_intents_consumed_coherent check (
    status <> 'consumed' or consumed_at is not null
  ),
  constraint provider_connection_intents_updated_after_created check (updated_at >= created_at)
);

create index provider_connection_intents_owner_idx
  on public.provider_connection_intents (owner_id);

create index provider_connection_intents_passport_idx
  on public.provider_connection_intents (passport_id);

create table public.provider_callback_states (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  passport_id uuid not null,
  connection_intent_id uuid null references public.provider_connection_intents(id) on delete set null,
  provider text not null,
  status text not null default 'pending',
  state_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_callback_states_passport_owner_fk foreign key (passport_id, owner_id)
    references public.gaming_passports (id, owner_id)
    on delete cascade,
  constraint provider_callback_states_provider_state_uid unique (provider, state_hash),
  constraint provider_callback_states_provider_check check (provider in ('discord', 'riot')),
  constraint provider_callback_states_status_check check (
    status in ('pending', 'consumed', 'expired', 'cancelled')
  ),
  constraint provider_callback_states_state_hash_length check (
    state_hash = btrim(state_hash)
    and char_length(state_hash) between 16 and 256
  ),
  constraint provider_callback_states_consumed_coherent check (
    status <> 'consumed' or consumed_at is not null
  ),
  constraint provider_callback_states_updated_after_created check (updated_at >= created_at)
);

create index provider_callback_states_owner_idx
  on public.provider_callback_states (owner_id);

create index provider_callback_states_passport_idx
  on public.provider_callback_states (passport_id);

create table public.provider_token_vault (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  passport_id uuid not null,
  linked_provider_account_id uuid null,
  provider text not null,
  token_status text not null default 'empty',
  token_ciphertext text null,
  token_version integer not null default 0,
  revoked_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_token_vault_passport_owner_fk foreign key (passport_id, owner_id)
    references public.gaming_passports (id, owner_id)
    on delete cascade,
  constraint provider_token_vault_provider_check check (provider in ('discord', 'riot')),
  constraint provider_token_vault_status_check check (
    token_status in ('empty', 'placeholder', 'revoked')
  ),
  constraint provider_token_vault_version_check check (token_version >= 0),
  constraint provider_token_vault_no_ciphertext_in_pr16 check (token_ciphertext is null),
  constraint provider_token_vault_revoked_coherent check (
    token_status <> 'revoked' or revoked_at is not null
  ),
  constraint provider_token_vault_updated_after_created check (updated_at >= created_at)
);

create index provider_token_vault_owner_idx
  on public.provider_token_vault (owner_id);

create index provider_token_vault_passport_idx
  on public.provider_token_vault (passport_id);

create table public.provider_sync_jobs (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  passport_id uuid not null,
  provider text not null,
  status text not null default 'blocked',
  reason text not null default 'provider_runtime_not_live',
  attempt_count integer not null default 0,
  scheduled_for timestamptz not null default now(),
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint provider_sync_jobs_passport_owner_fk foreign key (passport_id, owner_id)
    references public.gaming_passports (id, owner_id)
    on delete cascade,
  constraint provider_sync_jobs_provider_check check (provider in ('discord', 'riot')),
  constraint provider_sync_jobs_status_check check (
    status in ('blocked', 'queued', 'skipped', 'completed', 'failed')
  ),
  constraint provider_sync_jobs_reason_length check (
    reason = btrim(reason)
    and char_length(reason) between 1 and 120
  ),
  constraint provider_sync_jobs_attempt_count_check check (attempt_count between 0 and 20),
  constraint provider_sync_jobs_completed_coherent check (
    status <> 'completed' or completed_at is not null
  ),
  constraint provider_sync_jobs_updated_after_created check (updated_at >= created_at)
);

create index provider_sync_jobs_owner_idx
  on public.provider_sync_jobs (owner_id);

create index provider_sync_jobs_passport_idx
  on public.provider_sync_jobs (passport_id);

create table public.provider_audit_events (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  passport_id uuid not null,
  provider text not null,
  event_type text not null,
  event_status text not null default 'recorded',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint provider_audit_events_passport_owner_fk foreign key (passport_id, owner_id)
    references public.gaming_passports (id, owner_id)
    on delete cascade,
  constraint provider_audit_events_provider_check check (provider in ('discord', 'riot')),
  constraint provider_audit_events_type_check check (
    event_type in (
      'connection_intent_created',
      'callback_state_created',
      'intent_consumed',
      'unlink_requested',
      'revoke_requested',
      'sync_job_created'
    )
  ),
  constraint provider_audit_events_status_length check (
    event_status = btrim(event_status)
    and char_length(event_status) between 1 and 80
  ),
  constraint provider_audit_events_metadata_object check (jsonb_typeof(metadata) = 'object'),
  constraint provider_audit_events_metadata_size check (pg_column_size(metadata) <= 4096)
);

create index provider_audit_events_owner_idx
  on public.provider_audit_events (owner_id);

create index provider_audit_events_passport_idx
  on public.provider_audit_events (passport_id);

create trigger set_provider_connection_intents_updated_at
before update on public.provider_connection_intents
for each row execute function private.set_updated_at();

create trigger set_provider_callback_states_updated_at
before update on public.provider_callback_states
for each row execute function private.set_updated_at();

create trigger set_provider_token_vault_updated_at
before update on public.provider_token_vault
for each row execute function private.set_updated_at();

create trigger set_provider_sync_jobs_updated_at
before update on public.provider_sync_jobs
for each row execute function private.set_updated_at();

alter table public.provider_connection_intents enable row level security;
alter table public.provider_callback_states enable row level security;
alter table public.provider_token_vault enable row level security;
alter table public.provider_sync_jobs enable row level security;
alter table public.provider_audit_events enable row level security;

revoke all on table
  public.provider_connection_intents,
  public.provider_callback_states,
  public.provider_token_vault,
  public.provider_sync_jobs,
  public.provider_audit_events
from anon;

revoke all on table
  public.provider_connection_intents,
  public.provider_callback_states,
  public.provider_token_vault,
  public.provider_sync_jobs,
  public.provider_audit_events
from public;

revoke all on table
  public.provider_connection_intents,
  public.provider_callback_states,
  public.provider_token_vault,
  public.provider_sync_jobs,
  public.provider_audit_events
from authenticated;

grant select, insert, update on table public.provider_connection_intents to authenticated;
grant select, insert, update on table public.provider_callback_states to authenticated;
grant select, insert, update on table public.provider_sync_jobs to authenticated;
grant select, insert on table public.provider_audit_events to authenticated;

create policy "provider_connection_intents_select_own"
on public.provider_connection_intents
for select
to authenticated
using (owner_id = auth.uid());

create policy "provider_connection_intents_insert_own"
on public.provider_connection_intents
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "provider_connection_intents_update_own"
on public.provider_connection_intents
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "provider_callback_states_select_own"
on public.provider_callback_states
for select
to authenticated
using (owner_id = auth.uid());

create policy "provider_callback_states_insert_own"
on public.provider_callback_states
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "provider_callback_states_update_own"
on public.provider_callback_states
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "provider_sync_jobs_select_own"
on public.provider_sync_jobs
for select
to authenticated
using (owner_id = auth.uid());

create policy "provider_sync_jobs_insert_own"
on public.provider_sync_jobs
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "provider_sync_jobs_update_own"
on public.provider_sync_jobs
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "provider_audit_events_select_own"
on public.provider_audit_events
for select
to authenticated
using (owner_id = auth.uid());

create policy "provider_audit_events_insert_own"
on public.provider_audit_events
for insert
to authenticated
with check (owner_id = auth.uid());
