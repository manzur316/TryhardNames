# Experience stratification — official sprint charter

This document formalizes **three experience tiers** already present in the codebase: **TOOL**, **HYBRID**, **IDENTITY**.  
Canonical machine-readable rules live in `src/governance/experienceTiers.js`.

**Atmosphere (focal lighting / motion budget):** separate from tier — see `LOCALIZED_ATMOSPHERE.md` and `src/governance/localizedAtmosphere.js`.

---

## 1. Official tier system

| Tier | Purpose | Philosophy |
|------|-----------|--------------|
| **TOOL** | Utility, SEO acquisition, generators, quick exploration | Solve fast; high clarity; repeatable utility |
| **HYBRID** | Guided exploration, curated discovery, restrained generators | Editorial rails without full identity studio |
| **IDENTITY** | Identity Kit, KR ladder lane, artifacts, typography-first | Calm read; surface-aware; minimal ornament |

---

## 2. Surface classification (ecosystem map)

Entries marked **⚠** carry intentional tier mixing or need slug-aware behavior.

| Surface / route | Tier | Notes |
|-----------------|------|--------|
| `DynamicPage` + `SeoTemplate` (`/category/keyword`) | **TOOL** | Default programmatic SEO; volume acquisition |
| `/league-of-legends/korean` + `SeoTemplate` | **IDENTITY** | KR ecology isolated (`lolKoreanLane`, intent signatures) ⚠ |
| `/league-of-legends` (`LeagueOfLegendsHubPage`) | **HYBRID** | Hub narrative + links into lanes |
| Topic hubs (`TopicHubPage`, `TOPIC_HUB_ROUTES`) | **HYBRID** | Intent guides + editorial sections |
| `/identity-kit` (`IdentityKitPage`) | **IDENTITY** | Artifacts, bundle export, culture notes |
| `GamerNamesLayout` + gamer name routes | **TOOL** | Category generators |
| `RobloxNamesLayout` + roblox routes | **TOOL** | Same |
| `GameNameGenerator` (embedded) | **TOOL** | Utility pacing |
| `StylishTextGeneratorPage` | **TOOL** | Unicode utility |
| `NicknameSymbolsPage` | **TOOL** | Symbol catalog utility |
| `GamerBioGeneratorPage` | **TOOL** | Bio utility |
| `LeaderboardsPage`, `FavoritesPage` | **TOOL** | Aggregation / utility |
| `HomePage` | **HYBRID** | Identity hero + quick sample + trending — **leakage hotspot** ⚠ |
| `TrendingNamesModule` | **HYBRID** | Curated discovery; must not own grid mutation |
| `TrendingNamesSection` | **HYBRID** | Home wrapper |
| `TrendingIdentitySection` | **HYBRID** | Thin wrapper over module |
| `HeroIdentitySection` | **HYBRID** | Editorial bridge toward Identity |
| Editorial blocks (`editorialSections`, `SeoTemplate` editorial) | **HYBRID** | Framing, not raw generator voice |

---

## 3. Grammar governance by tier

### TOOL — allowed

- Competitive / ranked / esports / sweaty phrasing aligned with game constraints  
- SEO-forward headings where truthful  
- Higher mutation tolerance (rerolls, variants)

### TOOL — discouraged

- Claiming “curated identity philosophy” without HYBRID or IDENTITY backing

### HYBRID — allowed

- Curated, readable, compact, trending labels  
- Soft mutations; surface-aware quick modes  
- Cross-links that explain intent

### HYBRID — discouraged

- Ecology bleed (sweaty grammar on KR lane, etc.)  
- Presenting trending as authoritative mutation of the primary grid

### IDENTITY — allowed

- Minimal, surface-aware, quiet read; KR ladder semantics  
- Composition profiles (`compositionProfiles`), behavioral curation

### IDENTITY — **disallowed**

- TTV / X spam patterns  
- +99 loops  
- Slot-machine mutation voice  
- Default esports suffix chains as “the” voice  
- Cyclic ornamentation  
- Forced coolness stacks as identity truth

---

## 4. Quick mode governance

| Tier | Quick modes |
|------|-------------|
| **TOOL** | streamer, esports, sweaty, ranked, funny, aesthetic, pro, edgy (lane-specific) |
| **HYBRID** | Soft presets only; bounded; no hard mutation chains |
| **IDENTITY** | KR quick modes (`LOL_KOREAN_QUICK_MODES`), Identity Kit moods — **no** aggressive transforms |

---

## 5. Badge / label governance

| Tier | Preferred labels |
|------|-------------------|
| TOOL | Competitive, Ranked, Esports, Sweaty, Streamer |
| HYBRID | Curated, Readable, Compact, Trending |
| IDENTITY | Minimal, Surface-aware, Quiet read, Artifact |

---

## 6. Visual energy governance

| Tier | Gradients / glow / motion |
|------|---------------------------|
| TOOL | Higher energy acceptable |
| HYBRID | One notch quieter; fewer simultaneous accents |
| IDENTITY | Calm editorial; glow and motion sparing |

---

## 7. Migration governance (TOOL → HYBRID → IDENTITY)

**TOOL → HYBRID**

- Add editorial framing (not generator-only)  
- Bound quick modes  
- Step visual energy down slightly  

**HYBRID → IDENTITY**

- Remove IDENTITY-disallowed grammar  
- Typography-first or artifact-ready structure  
- Isolate ecology or attach explicit composition profile  

**Debt to remove before promotion**

- Slot-machine copy paths  
- Shared lexicon with unrelated sweaty lanes (unless explicitly bridged)

---

## 8. System boundaries (non-negotiable)

1. Trending does **not** mutate programmatic grids (`TrendingNamesModule` ownership).  
2. Identity Kit does **not** adopt raw generator hype grammar.  
3. KR lane does **not** share ecology with global recycled style sludge.  
4. TOOL generators do **not** contaminate artifact pipelines without an explicit tier bridge.

See `SYSTEM_BOUNDARIES` in `experienceTiers.js`.

---

## 9. Localhost verification (visual classification)

**Procedure:** `npm run dev` (default port **3000**; Vite may use **3005** if lower ports are busy) — spot-check:

| URL | Expected tier |
|-----|----------------|
| `/` | HYBRID (mixed modules) |
| `/valorant/sweaty` | TOOL |
| `/league-of-legends/korean` | IDENTITY |
| `/league-of-legends` | HYBRID |
| `/identity-kit` | IDENTITY |
| `/competitive-gamer-names` | HYBRID |

**Leakage to watch:** Home hero (identity-forward) sitting above TOOL quick sample; SeoTemplate KR vs non-KR tone.

---

## 10. Dangerous surfaces & brutal scalability verdict

### Still dangerous (ambiguous coupling)

- **HomePage** — three philosophies visible without explicit tier chrome  
- **SeoTemplate** — must stay slug-aware (KR vs default TOOL)  
- **LoL hub → lane links** — user expectation vs actual tier per lane  

### Scalability verdict

The codebase **can** scale without coherence loss **if**:

1. Every new route declares a tier (eventually `pageData.experienceTier` or router metadata).  
2. Grammar and ecology ownership stay enforced per lane (already started for KR).  
3. HYBRID surfaces avoid importing TOOL-only verbal kits verbatim.

**Pass criteria:** Users rarely feel “random features mashed together”; instead they feel **layered product**: utility lanes, curated hubs, identity studio.

---

## Final deliverables checklist

1. Official tier system — `experienceTiers.js` + this doc  
2. Surface classification — §2 + `SURFACE_COMPONENT_TIER`  
3. Grammar governance — §3  
4. Quick mode governance — §4  
5. Badge governance — §5  
6. Visual energy — §6  
7. Migration rules — §7  
8. System boundaries — §8  
9. Risk register — §10 + `HIGH_LEAKAGE_RISK_SURFACES`  
10. Coherence verdict — §10  
