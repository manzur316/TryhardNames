# Surface Migration & Perception Priority

How to shift **global perception** toward *identity culture* with **few strategic edits**, not a sitewide rewrite.

Companion: `ROOT_PHILOSOPHY_GOVERNANCE.md`.

---

## 1. Surfaces that control the most perception

Ordered by **psychological weight × traffic**:

| Priority | Surface | Why it dominates |
|----------|-----------|------------------|
| A | **Home first screen** (`HeroIdentitySection`) | Only chance for “what is this?” before scroll |
| B | **`SeoTemplate` programmatic shell** | Shared by most long-tail routes — hero, CTAs, grid, badges, activity strip |
| C | **Global navigation** (`Navigation.jsx`) | Every page; logo gradient + dropdown microcopy repeat “tool catalog” |
| D | **LoL identity hub** (`LeagueOfLegendsHubPage`) | High-intent users; already nearer brand — reinforces or contradicts home |
| E | **SEO headline blocks** (first H2 above fold if any) | When brand and SEO compete in the same viewport, perception defaults to SEO |

**What makes the brain say “generator website” in seconds**

- Verdict words: **utility**, **sampler**, **shuffle**, **remix**, **generate**
- **Loot framing**: Ultra / Rare / Stylish as headline emotion on cards
- **Visual**: dual gradient headline + thick CTA shadows + dashboard-style control row
- **Catalog nav**: endless “names” + emoji + “competitive / hilarious” without identity thesis

---

## 2. Highest payoff changes (small → large perception shift)

Leveraged edits — **not** invisible polish:

1. **Home eyebrow + primary CTA text** — replaces “utility + sampler” mental model in one glance.
2. **`SeoTemplate` primary actions** — rename **Shuffle / Remix / Cleaner / Sweaty** to exploration vocabulary (same behavior).
3. **Card badges** — demote **Ultra/Rare/Stylish** from primary card emotion (secondary meta, tooltip, or remove).
4. **Non-KR programmatic hero** — soften gradient-on-last-word **or** swap second line to flat high-contrast type (one experiment).
5. **Logo in nav** — reduce gradient-logo-as-brand **or** pair with neutral wordmark moment (subtle but repeated).

Each item touches **many impressions per line of copy changed**.

---

## 3. Surfaces already near target (reference)

Use as **implementation references**, not exceptions:

- **`league-of-legends` hub** — “Identity universe”, lanes narrative, calm hero structure
- **KR lane** (`laneExperience === 'lol-korean'`) — restrained hero, “New draw”, discovery typography, no rarity badges
- **Editorial blocks** in `SeoTemplate` — when tone matches governance
- **LoL nav entry** — “Identity hub · Summoner lanes & culture” (aligned vocabulary)

**Rule:** When migrating another branch, **diff against KR/hub**, not against generic programmatic defaults.

---

## 4. Migration waves (pragmatic)

### P0 — Perception pivot (minimum viable migration)

*Estimated effort: days, not weeks — mostly copy + light class tweaks.*

- Home: eyebrow, supporting line, primary + secondary CTA labels (keep scroll target behavior).
- `SeoTemplate`: primary button labels; optional — soften hero gradient pattern for non-KR **or** ship copy-first.
- `SeoTemplate`: rarity badges — downgrade or relocate per governance.

**Exit criterion:** New user can articulate “identity / how I’m read” **before** “generator” on home + one programmatic page.

### P1 — System coherence

- Typography: reduce **Orbitron** dominance on marketing heroes; tighten hierarchy per `ROOT_PHILOSOPHY_GOVERNANCE.md` §8.
- Navigation: dropdown descriptions toward **scene + read** not **adjective + names** only.
- Lane intros / `namesSectionLead` defaults — identity framing over “tap to copy faster.”
- `LiveActivityStrip`: review copy tone — observational, not hype ticker.

### P2 — Breadth without contamination

- SEO templates: ensure **brand layer** never replaced by keyword H1 in hero (split sections per governance §7).
- Legacy pages with heavy gradients / “Generate instantly” meta — **acquisition-only** fixes.
- Card grid density / hover stack — reduce **theatre** where still loud.

---

## 5. What still screams “generator”

| Signal | Where |
|--------|--------|
| “Try the sampler” | Home |
| “Gaming identity **utility**” | Home eyebrow |
| Shuffle / Remix / Sweaty / Shorter as **main verbs** | `SeoTemplate` |
| Ultra / Rare / Stylish badges | `SeoTemplate` cards (non-KR) |
| Gradient wordmark + gradient hero block | Nav + home + programmatic hero |
| Dropdowns: “Hilarious names”, “Top gaming names” | `Navigation.jsx` |
| Analytics-driven activity line | `LiveActivityStrip` (can feel “live feed” — tune voice) |

---

## 6. What already feels “brand” / universe

- LoL hub narrative and lane cards
- KR lane hero + ecology controls + muted discovery cards
- Editorial sections when calm and analytical
- Chips / quiet utilities (`.th-chip-quiet`) when not fighting louder layers

---

## 7. Typography migration direction

**From:** UI-heavy / sci-fi display + gradient emphasis + badge stacks  
**To:** typography-first identity — **type and spacing** carry authority.

| Move | Action |
|------|--------|
| Display vs body | Fewer display faces; more weight contrast on **neutral** sans |
| Hero | One accent mechanism per view: **either** gradient **or** oversized display, not both at max |
| Names | Strong monospace or semibold for **scan**; meta line smaller/lighter |
| Motion | Prefer opacity / subtle translate over lift+glow+scale everywhere |

**Not** “everything minimal” — **controlled emotional pressure**.

---

## 8. SEO layer migration (no contamination)

Per governance **brand vs acquisition**:

- **Never** swap hero H1 for keyword stuffing on branded routes.
- Keep long-tail **below** or clearly **sectioned** (“Guide”, “FAQ”) with matter-of-fact tone.
- Meta descriptions can stay search-literal; **Open Graph / social** titles can track brand layer for share perception.

**Acquisition preserved:** URLs, internal links, FAQ schema, keyword coverage — **voice** differentiates layers.

---

## 9. Low-ROI complexity (don’t protect by default)

High internal cost, **weak perception ROI** unless surfaced:

- Fine-grained intent anchors **without** user-visible vocabulary
- Extra shuffle seeds when UX still says “shuffle”
- Micro-tier opacity deltas when unlabeled (KR lab polish — **keep** for KR quality, don’t replicate complexity elsewhere first)

**Principle:** Ship **visible** governance wins before deeper algorithm tuning on secondary routes.

---

## 10. Perception shift test — **Top 5 surfaces** if only five changes

If you could only migrate **five levers** for maximum total perception shift:

| # | Surface / lever | Why |
|---|-----------------|-----|
| 1 | **Home hero** — eyebrow + subline + primary CTA | Sets global frame for return visits and shares |
| 2 | **`SeoTemplate` — primary action row** (all programmatic) | Largest repeated “dashboard” signal |
| 3 | **`SeoTemplate` — card badges** (Ultra/Rare/Stylish) | Strongest “loot generator” read |
| 4 | **`SeoTemplate` — non-KR hero** (gradient / typographic balance) | First impression on most SEO landing pages |
| 5 | **Navigation** — logo treatment + 1–2 top dropdown label patterns | Every-page reinforcement |

**Honorable sixth:** `LiveActivityStrip` messaging — if it sits above fold on key templates.

---

## Deliverables summary

1. **Most influential:** Home, `SeoTemplate`, global nav, LoL hub, competing SEO headlines.
2. **“Generator feeling” trigger:** utility vocabulary + loot badges + dashboard verbs + gradient SaaS hero + catalog nav.
3. **Brand gravity today:** LoL hub, KR lane, editorial, quiet chips when visible.
4. **Waves:** P0 home + `SeoTemplate` verbs/badges/hero; P1 type + nav + leads; P2 SEO sectioning + legacy.
5. **P0 / P1 / P2:** As §4.
6. **Small → huge impact:** Copy swaps on home + `SeoTemplate` + badge demotion.
7. **Systems to stop over-investing in first:** Unlabeled micro-variance before visible reframing ships.
8. **SEO strategy:** Brand layer intact; acquisition below / sectional / literal meta OK.
9. **Typography:** One accent per view; neutral sans authority; less display+gradient competition.
10. **Top 5:** Table in §10.

---

## Final test

After P0, a new user should think:

> **“This is about how identity reads online”**

**before**

> **“This is a name generator.”**

If not, **do not** expand branches — tighten trunk surfaces first.

---

*Version 1.0 — operational; pair with `ROOT_PHILOSOPHY_GOVERNANCE.md`.*
