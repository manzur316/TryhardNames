import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const migrationName = readdirSync(new URL('../../../../supabase/migrations', import.meta.url))
  .find((name) => /saved_names\.sql$/.test(name));
const migrationSource = readRepo(`supabase/migrations/${migrationName}`);
const dbTestSource = readRepo('supabase/tests/database/saved_names_test.sql');
const repositorySource = readWeb('src/saved-names/data/savedNamesRepository.js');
const favoritesContextSource = readWeb('src/contexts/FavoritesContext.jsx');
const accountPageSource = readWeb('src/pages/AccountPage.jsx');
const favoriteStarSource = readWeb('src/components/FavoriteStarButton.jsx');
const minimalPeekSource = readWeb('src/components/MinimalFavoritesPeek.jsx');
const docsSource = readRepo('docs/product/SAVED_NAMES_PERSISTENCE.md');
const packageJson = JSON.parse(readWeb('package.json'));

describe('Saved Names Supabase persistence', () => {
  it('creates public.saved_names with owner-only constraints', () => {
    assert.ok(migrationName);
    assert.match(migrationSource, /create table public\.saved_names/);
    assert.match(migrationSource, /owner_id uuid not null references auth\.users\(id\) on delete cascade/);
    assert.match(migrationSource, /constraint saved_names_owner_name_key_uid unique \(owner_id, name_key\)/);
    assert.match(migrationSource, /constraint saved_names_name_key_canonical/);
    assert.match(migrationSource, /regexp_replace\(btrim\(name_key\)/);
    assert.match(migrationSource, /constraint saved_names_name_trimmed/);
    assert.match(migrationSource, /alter table public\.saved_names enable row level security/);
    assert.match(migrationSource, /create policy "saved_names_select_own"/);
    assert.match(migrationSource, /create policy "saved_names_insert_own"/);
    assert.match(migrationSource, /create policy "saved_names_update_own"/);
    assert.match(migrationSource, /create policy "saved_names_delete_own"/);
  });

  it('does not grant anon or public access to saved_names', () => {
    assert.match(migrationSource, /revoke all on table public\.saved_names from anon/);
    assert.match(migrationSource, /revoke all on table public\.saved_names from public/);
    assert.doesNotMatch(migrationSource, /grant\s+.+\s+on\s+.*saved_names\s+to\s+anon/i);
    assert.doesNotMatch(migrationSource, /grant\s+.+\s+on\s+.*saved_names\s+to\s+public/i);
    assert.match(dbTestSource, /anon cannot select saved_names/);
    assert.match(dbTestSource, /owner cannot update owner_id/);
  });

  it('exports the saved names repository contract', () => {
    [
      'mapSavedNameRow',
      'buildSavedNamePayload',
      'validateSavedNameInput',
      'listSavedNames',
      'upsertSavedName',
      'deleteSavedName',
      'deleteSavedNameByName',
      'syncLocalFavoriteNamesToAccount',
    ].forEach((name) => {
      assert.match(repositorySource, new RegExp(`export (async )?function ${name}`));
    });
    assert.match(repositorySource, /normalizeSavedNameKey/);
    assert.doesNotMatch(repositorySource, /rawPayload|accessToken|provider_token|riot|discord/i);
  });

  it('uses Supabase when Parent Auth session exists and preserves local fallback', () => {
    assert.match(favoritesContextSource, /useAuth/);
    assert.match(favoritesContextSource, /auth\.session\?\.user\?\.id/);
    assert.match(favoritesContextSource, /getSupabaseRuntime/);
    assert.match(favoritesContextSource, /syncLocalFavoriteNamesToAccount/);
    assert.match(favoritesContextSource, /readUnifiedFavoriteNames/);
    assert.match(favoritesContextSource, /local-fallback/);
    assert.match(favoritesContextSource, /legacy-pocketbase/);
  });

  it('keeps Account Dashboard Saved Names wired without legacy lineup UX', () => {
    assert.match(accountPageSource, /Saved Names/);
    assert.match(accountPageSource, /Synced to this account/);
    assert.match(accountPageSource, /Saved locally on this device/);
    assert.match(accountPageSource, /favoritesContext\?\.removeFavorite/);
    assert.doesNotMatch(accountPageSource, /Lineup|Copy pack|Export Discord Pack|Recent picks/);
  });

  it('keeps FavoriteStarButton and MinimalFavoritesPeek on the canonical context path', () => {
    assert.match(favoriteStarSource, /FavoritesContext/);
    assert.match(favoriteStarSource, /favoritesContext\?\.addFavorite/);
    assert.match(favoriteStarSource, /favoritesContext\?\.removeFavorite/);
    assert.match(minimalPeekSource, /FavoritesContext/);
    assert.match(minimalPeekSource, /favoritesContext\?\.removeFavorite/);
  });

  it('documents scope and non-goals without provider runtime claims', () => {
    assert.match(docsSource, /Saved Names Supabase Persistence/);
    assert.match(docsSource, /favorite\/star canonical/i);
    assert.match(docsSource, /owner-only RLS/i);
    assert.match(docsSource, /Local fallback/i);
    assert.match(docsSource, /no providers/i);
    assert.doesNotMatch(`${docsSource}\n${favoritesContextSource}\n${accountPageSource}`, /Riot OAuth is live|Discord OAuth is live|Continue with Riot|Continue with Discord/i);
  });

  it('is included in auth tests and repository tests are included in npm test', () => {
    assert.match(packageJson.scripts['test:auth'], /saved-names-persistence\.test\.js/);
    assert.match(packageJson.scripts.test, /saved-names\/repository\.test\.js/);
  });
});
