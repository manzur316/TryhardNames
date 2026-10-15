# Passport Visual Assets

## User-supplied background pack (2026-10-14)

Eight owner-supplied landscapes are available under **Appearance > Background**. The collapsible native radio picker shows a thumbnail and name for each option. Original preserves the previous background; importing this pack does not automatically change the owner's selection. Changes preview immediately and use the existing Save Passport and Discard workflow.

| Name / filename stem | Supplied clipboard image ID |
| --- | --- |
| Sakura Lake / `sakura-lake` | `57661f7c-4138-4159-b1d3-272d24ecba39` |
| Sky Islands / `sky-islands` | `1db97609-1141-4833-a7b3-ec5934e96d7f` |
| Amethyst Citadel / `amethyst-citadel` | `4b7bc62a-5950-4cd2-8128-81f70eefc1e9` |
| Lunar Falls / `lunar-falls` | `8574eb19-398d-4395-a70c-607cb1d371f3` |
| Astral Nexus / `astral-nexus` | `8cfea466-18fd-40db-be6e-58f83ab3ac3d` |
| Luminous Grove / `luminous-grove` | `0ab2bda1-67f7-48a2-86d8-8e92fa40fe1b` |
| Neon Gateway / `neon-gateway` | `ec6a638d-513a-40aa-8f68-248505bc62fd` |
| Cyber City / `cyber-city` | `7d9765a2-d1ae-4e38-949b-4dd813976500` |

Files live in `apps/web/public/passport/backgrounds/` as `<id>.webp` and `<id>.thumb.webp`. Original PNGs are untouched. Existing Sharp encoded 1672 x 941 WebP copies at quality 82 and proportionally downscaled 320px thumbnails at quality 75. No artwork was generated, recoloured or composited. Each full image is below 350,000 bytes; each thumbnail is below 20,000 bytes. Only the selected full-size background is used by the header, with lazy-loaded picker thumbnails and the existing directional gradient over the image.

The optional `scene_config.backgroundId` accepts only the eight IDs in `profileBackgrounds.js`. Original, unknown IDs, URLs and objects are omitted and resolve to the legacy citadel background. Saving changes presentation only, preserving alias, biography, avatar, frame, theme, accent and publication fields. The ID does not enter the public projection; public rendering is unchanged. No database migration, policy, environment or provider change is needed.

The isolated browser check rendered all eight backgrounds at 1440px and 375px and the picker at 320/375/768/1440px. It checked image decoding and pixels, label fit, keyboard selection and focus, save/reload, session-refresh retention, failed-save retention, discard and restoration of Original. All account and database requests were intercepted fixtures, with zero real auth/database requests or staging writes. Unit tests cover asset bounds, catalog validation, all-ID local and repository round-trips, legacy defaults and unchanged private publication fields.

## User-supplied game insignias (2026-10-14)

Nine decorative game insignias supplied by the owner are stored in `apps/web/public/passport/game-badges/`. Original PNG files are untouched. WebP copies retain the artwork and transparency, downscaled to 384 x 384 with quality 88 and lossless alpha. The complete pack is 431,472 bytes; the osu! asset is 45,644 bytes. Only the image for an actual rendered card is loaded.

| Game / filename | Supplied clipboard image ID |
| --- | --- |
| Fortnite / `fortnite.webp` | `c15059f0-a320-41d5-82d0-96f95be47d2d` |
| Rocket League / `rocket-league.webp` | `462f5e83-1d81-4b22-a088-0b9b0277589c` |
| Apex Legends / `apex-legends.webp` | `0d8c591c-9462-4326-a1ab-d3ca4ae8de7f` |
| VALORANT / `valorant.webp` | `94a21053-f010-4b57-9f88-e2ba9a94b7b2` |
| osu! / `osu.webp` | `537e8542-a860-4ea4-ae5d-0eb1be30c38c` |
| Counter-Strike 2 / `counter-strike-2.webp` | `e80da9b5-3f88-405e-9c9c-bef96d40c1bd` |
| Brawl Stars / `brawl-stars.webp` | `6272bff6-1905-4eae-b1e3-e3968fc18e93` |
| League of Legends / `league-of-legends.webp` | `f6f79907-1595-4635-950e-bcdfef757809` |
| Clash of Clans / `clash-of-clans.webp` | `0701e099-bbc2-4656-9d32-0c7ea9363c54` |

`gameBadges.js` is a visual asset catalog, not a provider registry or an entitlement table. `GameBadge` renders decorative art beside the existing game name. Current private osu! highlights and detail cards use its insignia; the connection button retains the unmodified official osu! logo. Other entries are reserved assets, not working integrations. No new badges, games or ranks are saved to the database or inferred from an image. Ownership and stale indicators continue to come from the existing validated connection snapshot.

These are owner-provided stylized game illustrations, not official achievement/rank icons or claims of endorsement. Publisher branding/asset-use review remains a release consideration; this local import does not establish licensing rights. Public projection, public profile visuals and publication controls are unchanged.

## Identity-first private header (2026-10-14)

The new `Panel de Perfil Gaming Futurista.png` reference guides the private header. Following the owner's request for a faded image, the selected background sits behind a directional dark gradient. The existing `passport-citadel-v2.webp` remains the Original default; the eight landscapes above are selectable alternatives. There is no separate image column. The selected avatar/frame and real saved private game highlights stay in the foreground. A single highlight is limited to 260px; four tiles form a two-column mosaic on larger screens. Existing public scene artwork and game-detail artwork are unchanged. No new artwork was generated or copied from the mockup.

All Classic, Halloween and Christmas frames remain selectable. The account highlight now uses the owner-supplied osu! insignia described above; the official logo is unchanged on the connection button. Ownership verification is distinct from PP and global rank; none of the mockup's additional games, rank emblems or statistics are fabricated. See `GAMING_PASSPORT_UNIFIED_WORKSPACE.md` for data flow and verification. The following entries record the provenance of the existing assets.

## User-supplied Christmas pack (2026-10-14)

Four additional owner-supplied frames are available under **Appearance > Avatar frame > Christmas**. Classic and Halloween remain unchanged. All collections share the same native radio group; no Christmas frame is automatically equipped or claimed as an earned cosmetic.

| Name / ID | File in `apps/web/public/passport/` | Bytes | WebP quality | Original clipboard image ID |
| --- | --- | ---: | ---: | --- |
| Frost / `christmas-frost` | `frame-christmas-frost.webp` | 191860 | 88 | `4953df1a-46e9-4039-a00e-72e43e288efd` |
| Gingerbread / `christmas-gingerbread` | `frame-christmas-gingerbread.webp` | 156752 | 90 | `391d2b57-bbcd-4d8f-aef2-96ac24285c3b` |
| Woodland / `christmas-woodland` | `frame-christmas-woodland.webp` | 194760 | 88 | `0ecc8a8f-bbbc-49ac-befb-118fb32b9728` |
| Noel / `christmas-noel` | `frame-christmas-noel.webp` | 172814 | 90 | `dfea86fe-12d3-4d86-9c9d-855b90773da0` |

Original PNGs are untouched at 1254 x 1254. Existing Sharp proportionally resized the project copies to 640 x 640, with alpha quality 100 and effort 6. Colour quality was reduced to 88 for the two most detailed images to stay below the existing 200,000-byte per-frame budget. No artwork was regenerated, recoloured or composited. Transparent exteriors and centers were checked after decoding: browser checks allow one alpha step out of 255 at the center for proportional-resampling residue in Woodland.

Only the catalog's allowlisted `avatarFrameId` is saved through the existing private presentation workflow. Collection metadata, asset paths, sizing and unlock claims are not accepted in user payloads. No database, public projection, provider, authentication or publication changes are required.

The isolated browser check rendered all fifteen user-supplied frames at 1440px and 375px, and checked the full selector at 1440px, 375px and 320px. Christmas checks include image decoding/transparency, keyboard movement from Halloween to Christmas, visible focus, label fit, save/reload, retention across session refresh and failed save, and discard. All auth and data requests were intercepted synthetic fixtures, with no staging writes. Pure tests cover stable IDs, collection membership, bounded assets and fits, allowlisted presentation, all-frame draft round-trips and unchanged private publication fields.

## User-supplied Halloween pack (2026-10-14)

Five additional owner-supplied PNG frames appear under **Appearance > Avatar frame > Halloween**, alongside the unchanged Classic collection. All use the same native radio group and existing private presentation save flow. No frame is automatically equipped or treated as an earned achievement, entitlement or verification badge.

| Name / ID | File in `apps/web/public/passport/` | Bytes | Original clipboard image ID |
| --- | --- | ---: | --- |
| Midnight / `halloween-midnight` | `frame-halloween-midnight.webp` | 155972 | `d096459c-9839-4aec-a533-a0acb6cf49a0` |
| Candy / `halloween-candy` | `frame-halloween-candy.webp` | 162342 | `fb8da1fb-6e49-4ea4-b6e2-2c79ea9f84fa` |
| Coven / `halloween-coven` | `frame-halloween-coven.webp` | 177712 | `648df6d2-5790-4b78-b508-0112ca258e54` |
| Blood Moon / `halloween-blood-moon` | `frame-halloween-blood-moon.webp` | 181192 | `d1030367-1e42-4b06-9c28-6c6f873b9540` |
| Haunted / `halloween-haunted` | `frame-halloween-haunted.webp` | 176792 | `afbba9ab-7a42-4183-9d3d-45e9699cd9f6` |

The original 1254 x 1254 PNGs remain untouched. Existing Sharp proportionally encoded 640 x 640 WebP copies (quality 90, alpha quality 100, effort 6), preserving their transparent centers and exteriors without regeneration, recolouring or compositing. Per-frame portrait fits are static catalog data; only an allowlisted `avatarFrameId` is persisted. Collection labels, asset URLs and sizing cannot enter presentation payloads from user input.

Browser validation used synthetic sessions with external requests intercepted, not the owner's session or staging writes. All eleven supplied frames were checked at 1440px and 375px; the grouped selector was checked at 1440px, 375px and 320px. Checks include native keyboard navigation across collections, visible focus, label fit, Halloween save/reload, unsaved selection retention after session refresh, failed-save retention and discard. Unit tests cover collection membership, unique IDs/assets, every frame's draft round-trip and unchanged private status, slug and consent. Public projection, authentication, provider data, database schema and policies are unchanged.

## User-supplied frame collection (2026-10-14)

The owner supplied six generated PNGs for integration. The original clipboard files were left untouched; project copies have descriptive filenames and were proportionally downsampled from 1254 x 1254 to 640 x 640 WebP using existing Sharp (quality 90, alpha quality 100, effort 6). No artwork was regenerated, recoloured or composited. Transparency in the center and outside each frame was verified before integration.

| Name / ID | File in `apps/web/public/passport/` | Bytes | Original clipboard image ID |
| --- | --- | ---: | --- |
| Astral / `astral` | `frame-astral.webp` | 118986 | `3799e7c4-ff62-4d2b-bdf0-468266d1190a` |
| Void / `void` | `frame-void.webp` | 152868 | `2a98d123-9b42-4b60-98fd-9349037fc3e1` |
| Inferno / `inferno` | `frame-inferno.webp` | 109476 | `23c85e55-37b1-486b-907f-190009c053d1` |
| Verdant / `verdant` | `frame-verdant.webp` | 125408 | `0f373a48-5907-4330-8ffb-fbf7812c3c84` |
| Cyber / `cyber` | `frame-cyber.webp` | 89400 | `afa7d30d-9dd9-42d1-8a20-5f63cba7b4e7` |
| Glacier / `glacier` | `frame-glacier.webp` | 120722 | `220b7192-04e6-4b95-a138-54dc5d268be0` |

Appearance now has a native radio group with these six frames, the existing Obsidian ornament, Minimal, and Theme (automatic). Theme preserves the previous Obsidian/clean behavior for existing drafts. Explicit choices are independent of the selected theme, accent and avatar. The private scene uses fixed, per-asset portrait dimensions to fit each opening without editing the supplied art.

`scene_config.avatarFrameId` is an optional private presentation preference. The frontend accepts only IDs from `data/avatarFrames.js`; unknown IDs, URLs, CSS or objects are omitted and render the theme default. Only the ID is saved, never an image URL or user-supplied sizing/style data. Saving uses the existing allowlisted presentation update; no database migration or policy change is needed. The existing public projection omits this preference, and public headers do not consume it. These are decorative choices, not earned cosmetics, ranks, proof claims or unlocks.

The isolated browser test covered all six assets at 375px and 1440px, native radio keyboard selection/focus, preservation of alias/bio/avatar/theme/accent, save/reload, session-refresh retention of an unsaved selection and discard. It used intercepted synthetic sessions only, with no real staging writes. Pure regression tests cover legacy defaults, all allowlisted IDs, unsafe input rejection, asset availability, local draft and owner row round-trips, and unchanged publication fields.

## Private Passport header refresh (2026-10-14)

Two assets were created with the built-in `image_gen` tool and saved into the project, without overwriting the existing artwork:

| File in `apps/web/public/passport/` | Dimensions | Bytes | Use |
| --- | --- | ---: | --- |
| `passport-citadel-v2.webp` | 2160 x 720 | 266884 | Private header background |
| `passport-avatar-frame.webp` | 640 x 640 | 91224 | Private Obsidian theme portrait ornament |

The background is an edit of `passport-citadel.webp` using `moonlit-avatar.webp` as a character reference. The frame is a fresh transparent generation, including a transparent center. Existing Sharp encoded both as WebP with proportional resizing only; frame alpha was preserved and checked in the browser. Original PNGs remain in `C:/Users/Juandi Gamer/.codex/generated_images/019ef5bf-49bd-7ca3-8412-9ee4f7a595e3/`: `exec-758b7f69-8062-4090-bfef-1440a40bb05a.png` and `exec-0d5ae5c9-76bb-4ae8-9142-5055074728ed.png` respectively.

The scoped owner header preserves the selected alias, bio, avatar, accent and theme from the existing presentation form. A custom avatar takes precedence over the built-in portrait; load failures use initials, or a neutral icon for an empty identity. The clean theme retains its simple circular frame. The ornament is not a level, rank, unlock, proof or verification badge and contains no such data. Nothing writes profile data, changes consent, creates a slug or publishes a Passport. The existing public header retains its previous background and sharing policy.

### Final prompts

Background edit (inputs inspected before editing; opaque output):

```text
Edit the FIRST reference image into a more expressive gaming profile header illustration. Use the SECOND reference only for the original silver-haired masked character design. Preserve the first image's very wide panoramic 3:1 composition: left 55 percent is a spacious moonlit valley and distant gothic citadel, without a foreground character, suitable for an overlaid user avatar and white text; the character is only at the rightmost 30 percent. Replace the right-hand unmasked character with the same silver-haired masked fantasy character as the second reference, chest-up and facing slightly left, intricate black and silver armor, violet eyes. Make the art vivid and polished like a premium gaming profile illustration, with luminous violet highlights on the character and some architecture, cyan moonlight and subtle warm window lights, still natural rich charcoal shadows. The left must retain visible detailed landscape, not a blank gradient, and must not be too bright for white UI text. Sharp illustration, no blur, no bokeh, no floating decorative orbs, no logos, no typography, no badge, no stats, no UI, no border, no watermark. This is original decorative artwork, not an achievement. Produce a single panoramic 2160x720 or equivalent 3:1 image.
```

Frame generation (no input images; transparent output):

```text
Use case: stylized-concept. Asset type: transparent ornamental avatar frame for a private gaming profile. Generate ONE front-facing circular frame centered on a square transparent canvas, no portrait, no background. A sophisticated original fantasy ornament in polished silver and dark gunmetal, with restrained violet crystal inlays, fine cool cyan reflections, layered sculpted bevels. Similar visual sophistication to a premium game profile portrait frame, but NOT a rank badge: absolutely no numbers, labels, stars, crowns, shields, trophy, level plaque, emblems or text. The circular central hole must be completely transparent and centered exactly at canvas center, diameter 68% of the canvas. Thin metal ring around that opening, sculpted tapered armor-like flourishes down the outside left and right edges, a single slim diamond-shaped violet crystal at top, a short elegant pointed filigree at bottom. Keep all artwork fully inside canvas with 3% transparent margin. Outer decoration may occupy up to 94% width/height; nothing may intrude inside the centered transparent 68% diameter hole. Strong crafted silver materials and dimensional edge highlights, not flat vector, not cartoon, not a glowing blurry halo. Actual alpha transparency both outside AND inside the frame. No checkerboard baked in, no circular backing disc, no shadows in the hole. 1024x1024.
```

## Official osu! connection mark (2026-10-14)

`/passport/osu-logo.png` is a third-party official asset, not generated artwork. It is the unmodified 200 x 200 PNG from [ppy/osu-wiki](https://raw.githubusercontent.com/ppy/osu-wiki/master/wiki/Brand_identity_guidelines/img/usage-full-colour.png), as displayed by the [official brand identity guidelines](https://osu.ppy.sh/wiki/en/Brand_identity_guidelines). SHA-256: `59b271ad8b7822d4c67b9a931c7a05a324fa3bbf72331c4d3b9b4aa171e41cde`.

The connection control preserves the logo's aspect ratio, orientation, colours and internal elements. The raised shadow, focus outline and short entrance border animation belong to the surrounding button, not the logo. No logo rotation, distortion, recolouring, replacement typography or implied official endorsement is added. Reduced-motion preference removes animation and movement. It is served locally, without an extra third-party image request. The historical generated-asset record below applies only to the two original background illustrations.

## Scope and provenance

Created on 2026-10-14 with the official built-in `image_gen` tool, one fresh generation per asset. These are original AI-generated background illustrations, not game screenshots, official artwork, or evidence of player activity.

User-supplied mockups inspected with `view_image` for composition only:
- `Gaming Passport_ Identidad Multijuego.png`
- `Pasaporte Gaming_ Perfil de Nexor.png`

No third-party assets downloaded, no reference pixels composited, no logos, text, ranks, statistics, or verification claims baked into the images. No UI, backend, environment, dependency, commit, push, or deployment changes made by this asset task.

## Deliverables

| Public URL | Dimensions | Aspect | Bytes | Ready |
| --- | --- | --- | ---: | --- |
| `/passport/passport-citadel.webp` | 2160 x 720 | 3:1 | 204418 | Yes, for UI integration |
| `/passport/osu-rhythm.webp` | 1280 x 720 | 16:9 | 117482 | Yes, for UI integration |

Files live in `apps/web/public/passport/`. Both are opaque sRGB WebP, encoded mechanically using existing Sharp 0.34.5, quality 82, effort 6. Only proportional downsampling and format encoding were applied: no recoloring, compositing, overlays, or content edits.

Citadel: calm left-hand sky/landscape for alias and avatar; warrior and luminous architecture to the right. Preserve the 3:1 frame to retain both zones. Rhythm: quiet graphite left side; connected coral/pink hit targets, cyan slider track and synthesizer keys on the right. This is an original rhythm-game motif, not an official osu! beatmap.

Final WebP files were decoded and visually inspected. Existing `moonlit-cover.webp` and `moonlit-avatar.webp` were left intact, confirmed against SHA-256 hashes captured before generation. UI integration and responsive layout are owned by the other agent and were not tested here.

## Generation record

Original PNGs remain in the image tool's automatic output directory:
`C:/Users/Juandi Gamer/.codex/generated_images/01a13c2a-d538-7a10-9167-2e05f810c383/`

- Citadel: `exec-5e37ad94-52eb-4aa5-8cd2-bf706c2a105a.png`, 2172 x 724.
- Rhythm: `exec-1f56e4b9-b254-417a-a6d7-c80a1f653ef6.png`, 1672 x 941.
- Both calls used `transparent_background: false`, without edit/reference image arguments.

<details>
<summary>Exact final generation prompts</summary>

### Citadel

```text
Use case: stylized-concept.
Asset type: original ultrawide panoramic background artwork for a gaming identity profile, not a UI mockup. Compose a 3:1 landscape panorama, ideally 2400 x 800.
Primary request: an original moonlit citadel with one stylized fantasy warrior on the right, and natural calm space on the left for a future alias and avatar.
Scene: an expansive lunar stone citadel, architectural spires and bridges spanning a rocky valley. A real textured moon in the upper center-right illuminates silver stone, cyan-lit windows and a few amethyst crystal architectural inlays. Readable detailed architecture, beautiful luminous depth.
Subject: one original androgynous silver-haired fantasy warrior in graphite armor with restrained silver trim and a folded amethyst cloak, waist-up on the rightmost third. Distinctive original design, stylized painterly game concept art with strong shape language, not a recognizable franchise character. Entire face and head comfortably within frame, gaze toward left, no additional people.
Composition: left 42 percent is coherent low-detail moonlit sky, distant stone terraces and subdued midtone landscape, naturally calm for overlay but not a blank panel or black gradient. Main citadel centered around 58 percent, warrior face near 80 percent width and 40 percent height. Keep edge margins and safe vertical framing for wide headers. Image edge-to-edge, no borders.
Lighting: attractive controlled contrast with crisp silver illumination and multiple localized cyan and amethyst accents, visible midtones throughout. Luminous focal architecture and readable warrior, avoid uniformly dark or purple-only grading. No crushed blacks. No artificial black overlay.
Constraints: only background illustration, no text, no lettering, no logos, no watermarks, no avatar frames, no buttons, no stats, no rank badges or numbers. No bokeh, decorative orbs, floating confetti, glitter, gradient blobs or unnecessary particle effects. Moon is a physical scene element, not a decorative glow orb. All visual elements serve the citadel and warrior scene.
```

### Rhythm

```text
Use case: stylized-concept.
Asset type: original background illustration for a rhythm-game profile card, NOT a UI mockup or gameplay screenshot. Wide 16:9 landscape, ideally 1536 x 864.
Primary request: original abstract musical arcade art with a meaningful rhythm-game motif, using crisp hit circles and a flowing slider beat path, coral and hot pink with cyan accents against neutral graphite.
Scene and subject: a single deliberate rhythmic sequence of three or four flat ring-shaped hit targets linked by a sweeping curved slider track, with a few integrated angular audio waveform bars and a short segment of stylized synthesizer keys. The circular shapes are clearly flat playable targets connected in a rhythmic path, never floating spheres or random decorations. Graphic layered depth, restrained beveled arcade materials, sharp clean contour lines, memorable composition legible when small.
Composition: concentrate the sequence and synthesizer elements in the right two thirds, let the flowing track lead diagonally into them. Keep the left third quieter with graphite texture and sparse low-contrast audio-line details for future UI overlay. Edge-to-edge art; no panel frames or rounded card outline.
Lighting and palette: bright coral-red and vivid pink target rims, clean cyan secondary track accents and ivory key highlights over textured graphite charcoal. Controlled local luminous edges, readable midtones; avoid a uniformly dark image, avoid purple/blue dominant color grading, avoid overpowering bloom.
Constraints: no words, no letters, no digits on circles, no scores, no ranks, no statistics, no verification badges, no trophy graphics, no official logos, no osu logo, no brands, no watermarks, no buttons or HUD. Original art only, do not reproduce any existing game screenshot or beatmap.
Avoid: bokeh, decorative orbs, gradient blobs, floating particles, confetti, extraneous disconnected circles or lens flares. Every visual shape must contribute to the musical rhythm or arcade subject.
```

</details>

