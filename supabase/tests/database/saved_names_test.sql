begin;

create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(31);

create function pg_temp.test_sqlstate(statement text)
returns text
language plpgsql
as $$
begin
  execute statement;
  return '00000';
exception when others then
  return sqlstate;
end;
$$;

create function pg_temp.test_row_count(statement text)
returns integer
language plpgsql
as $$
declare
  affected_rows integer;
begin
  execute statement;
  get diagnostics affected_rows = row_count;
  return affected_rows;
exception when others then
  return -1;
end;
$$;

select has_table('public', 'saved_names', 'saved_names table exists');

select ok(
  (select relrowsecurity from pg_class where oid = 'public.saved_names'::regclass),
  'RLS is enabled for saved_names'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.saved_names'::regclass
      and contype = 'f'
      and confrelid = 'auth.users'::regclass
  ),
  'saved_names owner_id references auth.users'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.saved_names'::regclass
      and contype = 'u'
      and conkey = array[
        (
          select attnum
          from pg_attribute
          where attrelid = 'public.saved_names'::regclass
            and attname = 'owner_id'
        ),
        (
          select attnum
          from pg_attribute
          where attrelid = 'public.saved_names'::regclass
            and attname = 'name_key'
        )
      ]::smallint[]
  ),
  'saved_names uses unique(owner_id, name_key)'
);

select ok(
  not has_table_privilege('anon', 'public.saved_names', 'SELECT'),
  'anon has no saved_names select privilege'
);

select ok(
  not has_table_privilege('public', 'public.saved_names', 'SELECT'),
  'public has no saved_names select privilege'
);

select ok(
  has_table_privilege('authenticated', 'public.saved_names', 'SELECT')
  and has_column_privilege('authenticated', 'public.saved_names', 'owner_id', 'INSERT')
  and has_column_privilege('authenticated', 'public.saved_names', 'name', 'UPDATE')
  and not has_column_privilege('authenticated', 'public.saved_names', 'owner_id', 'UPDATE')
  and has_table_privilege('authenticated', 'public.saved_names', 'DELETE'),
  'authenticated has owner-scoped saved_names privileges with owner_id update guarded'
);

insert into auth.users (id, aud, role, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000101', 'authenticated', 'authenticated', now(), now()),
  ('00000000-0000-0000-0000-000000000102', 'authenticated', 'authenticated', now(), now());

set local role anon;
set local request.jwt.claim.sub = '';
set local request.jwt.claim.role = 'anon';

select is(
  pg_temp.test_sqlstate($$
    select count(*)::integer from public.saved_names
  $$),
  '42501',
  'anon cannot select saved_names'
);

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';
set local request.jwt.claim.role = 'authenticated';

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key, source_path, source_label, category, keyword)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Clutch Star',
      'clutch star',
      '/valorant/sweaty',
      'Valorant Sweaty',
      'valorant',
      'sweaty'
    )
  $$),
  '00000',
  'owner can insert own saved name'
);

select is(
  (
    select count(*)::integer
    from public.saved_names
    where name_key = 'clutch star'
  ),
  1,
  'owner can select own saved name'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000102';

select is(
  (
    select count(*)::integer
    from public.saved_names
    where name_key = 'clutch star'
  ),
  0,
  'owner B cannot see owner A saved name'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Cross Owner',
      'cross owner'
    )
  $$),
  '42501',
  'owner cannot insert row for another owner'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values (
      '00000000-0000-0000-0000-000000000102',
      'Clutch Star',
      'clutch star'
    )
  $$),
  '00000',
  'same name_key is allowed for different owners'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Clutch Star Again',
      'clutch star'
    )
  $$),
  '23505',
  'duplicate same name_key for same owner is rejected'
);

select is(
  pg_temp.test_row_count($$
    update public.saved_names
    set source_label = 'Updated source', copy_count = 2
    where name_key = 'clutch star'
  $$),
  1,
  'owner can update own safe saved name fields'
);

select is(
  pg_temp.test_sqlstate($$
    update public.saved_names
    set owner_id = '00000000-0000-0000-0000-000000000102'
    where name_key = 'clutch star'
  $$),
  '42501',
  'owner cannot update owner_id'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000102';

select is(
  pg_temp.test_row_count($$
    delete from public.saved_names
    where name_key = 'clutch star'
  $$),
  1,
  'owner B can delete own row with same name_key'
);

select is(
  pg_temp.test_row_count($$
    delete from public.saved_names
    where name_key = 'clutch star'
  $$),
  0,
  'owner B cannot delete owner A row'
);

set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';

select is(
  pg_temp.test_row_count($$
    delete from public.saved_names
    where name_key = 'clutch star'
  $$),
  1,
  'owner can delete own saved name'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values ('00000000-0000-0000-0000-000000000101', '   ', 'blank')
  $$),
  '23514',
  'blank name is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values ('00000000-0000-0000-0000-000000000101', ' Trimmed Name ', 'trimmed name')
  $$),
  '23514',
  'name with surrounding spaces is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values (
      '00000000-0000-0000-0000-000000000101',
      repeat('A', 81),
      'long-name'
    )
  $$),
  '23514',
  'oversized name is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Long key',
      repeat('k', 97)
    )
  $$),
  '23514',
  'oversized name_key is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values ('00000000-0000-0000-0000-000000000101', 'Upper key', 'Upper Key')
  $$),
  '23514',
  'name_key with uppercase letters is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values ('00000000-0000-0000-0000-000000000101', 'Outer key spaces', ' outer key spaces ')
  $$),
  '23514',
  'name_key with surrounding spaces is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key)
    values ('00000000-0000-0000-0000-000000000101', 'Inner key spaces', 'inner   key spaces')
  $$),
  '23514',
  'name_key with multiple internal spaces is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key, source_path)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Long source path',
      'long source path',
      repeat('p', 257)
    )
  $$),
  '23514',
  'oversized source_path is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key, source_label)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Long source label',
      'long source label',
      repeat('l', 121)
    )
  $$),
  '23514',
  'oversized source_label is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key, category)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Long category',
      'long category',
      repeat('c', 81)
    )
  $$),
  '23514',
  'oversized category is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key, keyword)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Long keyword',
      'long keyword',
      repeat('w', 121)
    )
  $$),
  '23514',
  'oversized keyword is rejected'
);

select is(
  pg_temp.test_sqlstate($$
    insert into public.saved_names (owner_id, name, name_key, copy_count)
    values (
      '00000000-0000-0000-0000-000000000101',
      'Negative copies',
      'negative copies',
      -1
    )
  $$),
  '23514',
  'negative copy_count is rejected'
);

reset role;

select * from finish();

rollback;
