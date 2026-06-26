import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const readWeb = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const readRepo = (path) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

const accountPageSource = readWeb('src/pages/AccountPage.jsx');
const privateEditorSource = readWeb('src/gaming-passport/components/PrivatePassportEditor.jsx');
const privatePreviewSource = readWeb('src/gaming-passport/components/PrivatePassportPreview.jsx');
const cosmeticsPanelSource = readWeb('src/gaming-passport/components/PassportCosmeticsPanel.jsx');
const cosmeticPickerSource = readWeb('src/gaming-passport/components/CosmeticPicker.jsx');
const cosmeticPreviewSource = readWeb('src/gaming-passport/components/CosmeticLoadoutPreview.jsx');
const passportRepositorySource = readWeb('src/gaming-passport/data/passportRepository.js');
const catalogSource = readWeb('src/gaming-passport/cosmetics/cosmeticCatalog.js');
const packageJson = JSON.parse(readWeb('package.json'));
const docs = readRepo('docs/product/PASSPORT_COSMETICS_FOUNDATION.md');

const privateCosmeticsSource = [
  privateEditorSource,
  privatePreviewSource,
  cosmeticsPanelSource,
  cosmeticPickerSource,
  cosmeticPreviewSource,
  passportRepositorySource,
  catalogSource,
].join('\n');

describe('Passport Cosmetics Foundation account integration', () => {
  it('adds the private Passport Cosmetics panel to the account editor flow', () => {
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/PassportCosmeticsPanel.jsx', import.meta.url)), true);
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/CosmeticPicker.jsx', import.meta.url)), true);
    assert.equal(existsSync(new URL('../../src/gaming-passport/components/CosmeticLoadoutPreview.jsx', import.meta.url)), true);
    assert.match(accountPageSource, /PrivatePassportEditor/);
    assert.match(privateEditorSource, /PassportCosmeticsPanel/);
    assert.match(privateEditorSource, /sanitizeCosmeticLoadout/);
    assert.doesNotMatch(privateEditorSource, /xl:grid-cols-\[/);
    assert.doesNotMatch(cosmeticsPanelSource, /xl:grid-cols-\[/);
  });

  it('keeps the UI copy visual-only and proof-safe', () => {
    assert.match(cosmeticsPanelSource, /Passport Cosmetics/);
    assert.match(cosmeticsPanelSource, /Visual-only identity cosmetics/);
    assert.match(cosmeticsPanelSource, /No fake proofs/);
    assert.match(cosmeticsPanelSource, /No rank boosts/);
    assert.match(cosmeticsPanelSource, /No Riot assets/);
    assert.match(cosmeticPreviewSource, /Visual-only/);
    assert.match(cosmeticPreviewSource, /do not create proof/);
    assert.match(docs, /Cosmetics can style identity/);
    assert.match(docs, /Cosmetics cannot manufacture proof/);
  });

  it('makes Obsidian Pulse equipable as a free foundation preview', () => {
    assert.match(cosmeticsPanelSource, /Obsidian Pulse/);
    assert.match(cosmeticsPanelSource, /Equip Obsidian Pulse preview/);
    assert.match(cosmeticsPanelSource, /foundation preview/i);
    assert.match(catalogSource, /theme\.obsidian-pulse/);
    assert.match(catalogSource, /free_foundation_preview/);
    assert.match(catalogSource, /premium_preview/);
  });

  it('stores only sanitized scene cosmetic loadout fields in the private draft', () => {
    assert.match(passportRepositorySource, /buildDefaultCosmeticLoadout/);
    assert.match(passportRepositorySource, /sanitizeCosmeticLoadout/);
    assert.match(privateEditorSource, /themeId/);
    assert.match(privateEditorSource, /equippedCosmeticIds/);
    assert.doesNotMatch(passportRepositorySource, /priceId|price_id|purchaseHistory|payment|checkout|subscription/);
  });

  it('does not add buying, checkout, store, or provider-connect runtime to account cosmetics', () => {
    assert.doesNotMatch(privateCosmeticsSource, /Buy|Checkout|Purchase|Subscribe|Stripe|MercadoPago|priceId|price_id|webhook/i);
    assert.doesNotMatch(privateCosmeticsSource, /Continue with Riot|Continue with Discord|Connect Riot|Connect Discord/i);
    assert.doesNotMatch(privateCosmeticsSource, /oauth\/authorize|authorize\?|api\.riotgames\.com|discord\.com\/api/i);
    assert.doesNotMatch(privateCosmeticsSource, /clientSecret|providerToken|provider_token|refreshToken/);
  });

  it('documents reserved Founder/Legacy and future cosmetics without activating them', () => {
    assert.match(catalogSource, /badge\.founder-reserved/);
    assert.match(catalogSource, /badge\.legacy-reserved/);
    assert.match(catalogSource, /RESERVED/);
    assert.match(cosmeticPickerSource, /Founder reserved/);
    assert.match(cosmeticPickerSource, /Legacy reserved/);
    assert.match(docs, /Founder and Legacy/);
    assert.match(docs, /reserved/);
  });

  it('is wired into the auth test script', () => {
    assert.match(packageJson.scripts['test:auth'], /passport-cosmetics-foundation\.test\.js/);
  });
});
