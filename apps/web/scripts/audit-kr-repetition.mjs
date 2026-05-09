/**
 * Audit KR lane repetition / pool depth / ecology salts (run from apps/web: node scripts/audit-kr-repetition.mjs).
 */

import {
  LOL_KOREAN_POOLS,
  buildLolKoreanSummonerNamesDetailed,
} from '../src/seo/leagueOfLegends/lolKoreanLane.js';
import { KR_PLAIN_BEHAVIORAL_LEXICON } from '../src/seo/leagueOfLegends/krBehavioralCuration.js';

const KR_SINGLE_EXTRAS = ['ren', 'vey', 'sol', 'ion'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function poolStats() {
  const cold = [...new Set(LOL_KOREAN_POOLS.cold.map((w) => w.toLowerCase()))];
  const tight = [...new Set(LOL_KOREAN_POOLS.tight.map((w) => w.toLowerCase()))];
  const mainSet = new Set([...cold, ...tight, ...KR_SINGLE_EXTRAS]);
  const plainSet = new Set(KR_PLAIN_BEHAVIORAL_LEXICON);
  const union = new Set([...mainSet, ...plainSet]);
  return {
    coldCount: cold.length,
    tightCount: tight.length,
    extrasCount: KR_SINGLE_EXTRAS.length,
    mainUnique: mainSet.size,
    plainCount: plainSet.size,
    unionUnique: union.size,
  };
}

function main() {
  const pools = poolStats();

  const runs = 50;
  const detailedRuns = [];
  for (let i = 0; i < runs; i++) {
    detailedRuns.push(buildLolKoreanSummonerNamesDetailed());
  }

  const firstSig = JSON.stringify(detailedRuns[0].names);
  const allIdentical = detailedRuns.every((d) => JSON.stringify(d.names) === firstSig);

  const uniqueAcrossRuns = new Set();
  for (const d of detailedRuns) {
    for (const n of d.names) uniqueAcrossRuns.add(n.toLowerCase());
  }

  const listLen = detailedRuns[0].names.length;

  const shuffleTrials = 5000;
  const multiset = detailedRuns[0].names;
  const orderSeen = new Set();
  for (let i = 0; i < shuffleTrials; i++) {
    orderSeen.add(JSON.stringify(shuffle(multiset)));
  }

  const saltSweep = [20, 50, 100];
  const saltResults = {};
  for (const n of saltSweep) {
    const u = new Set();
    for (let i = 0; i < n; i++) {
      const salt = `audit-sweep-${i}`;
      const { names } = buildLolKoreanSummonerNamesDetailed(salt);
      names.forEach((x) => u.add(x.toLowerCase()));
    }
    saltResults[`uniqueTokensAcross_${n}_distinctSalts`] = u.size;
  }

  console.log('=== KR repetition audit ===\n');
  console.log('POOL (lexicon union, lowercase dedupe)');
  console.log(pools);
  console.log('\nBUILD (same ecology salt = SSR default)');
  console.log({
    runs,
    allOutputsByteIdentical: allIdentical,
    namesPerList: listLen,
    uniqueStringsAcrossIdenticalRuns: uniqueAcrossRuns.size,
  });

  console.log('\nCONTROLLED ECOLOGY SALTS (distinct subsets / same universe)');
  console.log(saltResults);

  console.log('\nLegacy: multiset shuffle only changes order');
  console.log({
    shuffleTrials,
    uniqueOrderingsSeen: orderSeen.size,
    multisetUnchanged: true,
  });

  console.log('\nSample list (SSR salt):');
  console.log(detailedRuns[0].names.join(', '));

  console.log('\n--- Interpretation ---');
  console.log('- Same salt => identical output (SEO-stable).');
  console.log('- Different salts => different picks/orderings from the same KR lexicon.');
}

main();
