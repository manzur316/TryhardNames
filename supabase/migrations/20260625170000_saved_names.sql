create table public.saved_names (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  name_key text not null,
  source_path text null,
  source_label text null,
  category text null,
  keyword text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_used_at timestamptz null,
  copy_count integer not null default 0,
  constraint saved_names_owner_name_key_uid unique (owner_id, name_key),
  constraint saved_names_name_length check (char_length(btrim(name)) between 1 and 80),
  constraint saved_names_name_trimmed check (name = btrim(name)),
  constraint saved_names_name_key_length check (char_length(btrim(name_key)) between 1 and 96),
  constraint saved_names_name_key_canonical check (
    name_key = lower(regexp_replace(btrim(name_key), '\s+', ' ', 'g'))
  ),
  constraint saved_names_source_path_length check (
    source_path is null or char_length(source_path) <= 256
  ),
  constraint saved_names_source_label_length check (
    source_label is null or char_length(source_label) <= 120
  ),
  constraint saved_names_category_length check (category is null or char_length(category) <= 80),
  constraint saved_names_keyword_length check (keyword is null or char_length(keyword) <= 120),
  constraint saved_names_copy_count_check check (copy_count >= 0),
  constraint saved_names_updated_after_created check (updated_at >= created_at)
);

create index saved_names_owner_created_idx
  on public.saved_names (owner_id, created_at desc);

create trigger set_saved_names_updated_at
before update on public.saved_names
for each row execute function private.set_updated_at();

alter table public.saved_names enable row level security;

revoke all on table public.saved_names from anon;
revoke all on table public.saved_names from public;
revoke all on table public.saved_names from authenticated;

grant select on table public.saved_names to authenticated;

grant insert (
  owner_id,
  name,
  name_key,
  source_path,
  source_label,
  category,
  keyword,
  last_used_at,
  copy_count
) on public.saved_names to authenticated;

grant update (
  name,
  source_path,
  source_label,
  category,
  keyword,
  last_used_at,
  copy_count
) on public.saved_names to authenticated;

grant delete on table public.saved_names to authenticated;

create policy "saved_names_select_own"
on public.saved_names
for select
to authenticated
using (owner_id = auth.uid());

create policy "saved_names_insert_own"
on public.saved_names
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "saved_names_update_own"
on public.saved_names
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "saved_names_delete_own"
on public.saved_names
for delete
to authenticated
using (owner_id = auth.uid());
