import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  buildPinterestContentV2Response,
  listPinterestContentV2VisualFamilies,
} from '../src/services/pinterest/buildPinterestContentPayloadV2.js';
import {
  generateNamesV2,
  isBlockedGeneratedName,
  listNameEngineV2Styles,
  resolveNameContext,
} from '../src/services/pinterest/nameEngineV2.js';
import { getPinterestContentTopicDef } from '../src/services/pinterest/pinterestContentTopics.js';

const FORBIDDEN_CONTENT_TERMS = /\bMMR\b|\bELO\b|tracker|match history|official endorsement/i;
const pinterestContentRouteSource = readFileSync(
  new URL('../src/routes/v1/pinterestContent.js', import.meta.url),
  'utf8',
);

describe('MKT-02 Name Engine V2', () => {
  it('generates varied composed names with per-request dedupe', () => {
    const generated = generateNamesV2({
      count: 50,
      style: 'sweaty',
      topic: 'valorant-sweaty',
      seed: 'mkt02-name-diversity',
    });

    const uniqueNames = new Set(generated.map((item) => item.name.toLowerCase()));

    assert.equal(generated.length, 50);
    assert.equal(uniqueNames.size, generated.length);
    assert.ok(uniqueNames.size > 40);
  });

  it('returns generated-v2 metadata and supported style coverage', () => {
    const styles = listNameEngineV2Styles();
    assert.deepEqual(styles, [
      'clean',
      'sweaty',
      'dark',
      'aesthetic',
      'funny',
      'streamer',
      'brandable',
    ]);

    for (const style of styles) {
      const [name] = generateNamesV2({
        count: 1,
        style,
        topic: 'discord-usernames',
        seed: `mkt02-style-${style}`,
      });

      assert.equal(name.style, style);
      assert.equal(name.source, 'generated-v2');
      assert.equal(typeof name.noveltyScore, 'number');
      assert.ok(name.noveltyScore >= 0.5 && name.noveltyScore <= 1);
      assert.equal(name.context, 'social');
      assert.ok(name.parts.prefix || name.parts.stem || name.parts.suffix || name.parts.modifier);
    }
  });

  it('avoids exact real/pro player names', () => {
    assert.equal(isBlockedGeneratedName('Faker'), true);
    assert.equal(isBlockedGeneratedName('TenZ'), true);
    assert.equal(isBlockedGeneratedName('Chovy'), true);

    const generated = generateNamesV2({
      count: 50,
      style: 'sweaty',
      topic: 'gamer-names',
      seed: 'mkt02-blocked-names',
    });
    const names = generated.map((item) => item.name);

    for (const blocked of ['Faker', 'TenZ', 'Chovy', 'ShowMaker', 'Scump', 'Caps']) {
      assert.equal(names.includes(blocked), false);
    }
  });

  it('maps topic context for supported game and social groups', () => {
    assert.equal(resolveNameContext('valorant-usernames'), 'valorant');
    assert.equal(resolveNameContext('roblox-tryhard'), 'roblox');
    assert.equal(resolveNameContext('fortnite-sweaty'), 'fortnite');
    assert.equal(resolveNameContext('league-of-legends'), 'league-of-legends');
    assert.equal(resolveNameContext('gamer-names'), 'gamer-names');
    assert.equal(resolveNameContext('discord-usernames'), 'social');
  });
});

describe('MKT-02 Pinterest Content API V2 builder', () => {
  it('wires the content-v2 route without replacing content v1', () => {
    assert.match(pinterestContentRouteSource, /r\.get\('\/content'/);
    assert.match(pinterestContentRouteSource, /r\.get\('\/content-v2'/);
    assert.match(pinterestContentRouteSource, /buildPinterestContentResponse/);
    assert.match(pinterestContentRouteSource, /buildPinterestContentV2Response/);
  });

  it('keeps legacy Pinterest topics resolving through aliases', () => {
    assert.equal(getPinterestContentTopicDef('valorant-usernames').topic, 'valorant-sweaty');
    assert.equal(getPinterestContentTopicDef('roblox-usernames').topic, 'roblox-names');
    assert.equal(getPinterestContentTopicDef('discord-usernames').slug, 'brandable-usernames');
  });

  it('exposes at least ten visual families', () => {
    assert.deepEqual(listPinterestContentV2VisualFamilies(), [
      'minimal_typography',
      'pick_your_name_grid',
      'esports_character_poster',
      'dark_ui_dashboard',
      'gaming_passport_preview',
      'before_after_rebrand',
      'choose_your_vibe',
      'streamer_identity_card',
      'ranked_reset_drop',
      'clean_logo_tag',
    ]);
  });

  it('returns a complete single content-v2 campaign payload', () => {
    const body = buildPinterestContentV2Response({
      topic: 'valorant-usernames',
      random: 'false',
      count: '1',
      usernameCount: '8',
      visualFamily: 'pick_your_name_grid',
      intent: 'name_pick',
    });

    assert.equal(body.ok, true);
    assert.equal(body.topic, 'valorant-sweaty');
    assert.equal(body.visualFamily, 'pick_your_name_grid');
    assert.equal(body.intent, 'name_pick');
    assert.equal(typeof body.pinTitle, 'string');
    assert.equal(typeof body.pinDescription, 'string');
    assert.equal(typeof body.altText, 'string');
    assert.equal(typeof body.imagePrompt, 'string');
    assert.equal(typeof body.negativePrompt, 'string');
    assert.equal(typeof body.utmUrl, 'string');
    assert.equal(body.generatedNames.length, 8);
    assert.equal(body.generatedNames.every((item) => item.source === 'generated-v2'), true);
    assert.match(body.utmUrl, /utm_source=pinterest/);
    assert.match(body.utmUrl, /utm_campaign=mkt02-/);
  });

  it('returns count-based bundles when requested', () => {
    const body = buildPinterestContentV2Response({
      topic: 'roblox-names',
      count: '3',
      usernameCount: '6',
      random: 'false',
    });

    assert.equal(body.ok, true);
    assert.equal(body.count, 3);
    assert.equal(body.items.length, 3);
    assert.equal(body.items.every((item) => item.ok === true), true);
    assert.equal(body.items.every((item) => item.generatedNames.length === 6), true);
  });

  it('does not emit blocked competitive or endorsement terms in content-v2 payloads', () => {
    const body = buildPinterestContentV2Response({
      topic: 'league-of-legends',
      count: '2',
      usernameCount: '12',
      visualFamily: 'clean_logo_tag',
      intent: 'social_handle',
    });

    assert.equal(body.ok, true);
    assert.doesNotMatch(JSON.stringify(body), FORBIDDEN_CONTENT_TERMS);
  });
});
