# MKT-02 Content v2 Migration

This note describes how to migrate the existing n8n Pinterest workflow to the new generated content API without changing the committed importable workflow yet.

## Current State

The versioned workflow still calls:

`GET /api/v1/pinterest/content?topic=...&random=true&usernameCount=8`

That endpoint remains supported for compatibility.

MKT-02 adds:

`GET /api/v1/pinterest/content-v2`

Supported query parameters:

- `topic`
- `random`
- `count`
- `usernameCount`
- `visualFamily`
- `intent`

## Suggested n8n Migration

1. Duplicate the imported workflow in n8n.
2. Keep the original workflow inactive and unchanged.
3. In the duplicate workflow, update `GET Pinterest Content` to call content v2, for example:

   `https://tryhardnames.com/api/v1/pinterest/content-v2?topic={{$json.topic}}&random=true&usernameCount=8&visualFamily=pick_your_name_grid&intent=name_pick`

4. Update downstream nodes to prefer v2 fields:

- Use `generatedNames` for generated name objects.
- Use `usernames` only as a compatibility list of generated name strings.
- Use `pinTitle` and `pinDescription` for Pinterest SEO copy.
- Use `imagePrompt` and `negativePrompt` for image generation.
- Use `utmUrl` as the outbound Pinterest link when ready.
- Keep `canonicalUrl` available as the clean destination URL.

5. Smoke one manual run only from the duplicate workflow.
6. Compare the generated pin copy and image prompt before enabling a schedule.

## Visual Families

Content v2 supports these `visualFamily` values:

- `minimal_typography`
- `pick_your_name_grid`
- `esports_character_poster`
- `dark_ui_dashboard`
- `gaming_passport_preview`
- `before_after_rebrand`
- `choose_your_vibe`
- `streamer_identity_card`
- `ranked_reset_drop`
- `clean_logo_tag`

## Safe Smoke Checklist

- Keep the workflow inactive until n8n variables and credentials are configured.
- Do not change Vercel environment variables from n8n.
- Do not commit n8n credentials, board IDs, tokens, or secrets.
- Use a duplicate workflow for the smoke.
- Run one manual execution only.
- Confirm the final `Publish Direct` node still sends `X-TryhardNames-Automation-Secret` from the n8n variable.

## Rollback

If content v2 output is not ready for scheduled automation, revert the duplicate workflow's `GET Pinterest Content` node back to `/api/v1/pinterest/content`. The committed workflow remains on v1 during this migration window.
