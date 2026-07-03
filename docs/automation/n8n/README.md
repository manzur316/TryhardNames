# TryhardNames Pinterest n8n Workflow

This folder contains the importable n8n workflow export for the Pinterest automation gateway:

- `tryhardnames-pinterest-api.workflow.json`
- Final gateway endpoint: `POST /api/v1/integrations/pinterest/publish-direct`
- Final gateway header: `X-TryhardNames-Automation-Secret`

The workflow is inactive and starts with a manual trigger. It does not include tokens, API keys, board IDs, or exported n8n credential references.

## Import in n8n

1. Open n8n.
2. Go to **Workflows** and choose **Import from File**.
3. Select `docs/automation/n8n/tryhardnames-pinterest-api.workflow.json`.
4. Keep the workflow inactive until all variables and credentials are configured.
5. Assign credentials or variables in n8n, then run only with **Execute workflow**.

Expected flow:

`Manual Trigger -> Topic Rotation Engine -> GET Pinterest Content -> Visual Mutation Engine -> Build Pinterest SEO -> Build Dalle Prompt -> Generate image -> Upload To Cloudinary -> Merge -> Publish Direct`

## Content API v2 Migration Proposal

The checked-in workflow still calls the backwards-compatible v1 endpoint:

`GET /api/v1/pinterest/content`

MKT-02 adds a richer generated campaign endpoint:

`GET /api/v1/pinterest/content-v2`

Do not edit the importable workflow JSON until the n8n flow is migrated and smoked in a duplicate workflow. Use `MKT02_CONTENT_V2_MIGRATION.md` for the proposed node-by-node migration plan.

## n8n Configuration

Configure these in n8n before any run:

- OpenAI credential on the `Generate image` node.
- Cloudinary upload config used by the `Upload To Cloudinary` node:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_UPLOAD_PRESET`, set to the current Cloudinary upload preset.
- `PINTEREST_AUTOMATION_SECRET`, stored as an n8n variable or credential value. The workflow references it as `={{$vars.PINTEREST_AUTOMATION_SECRET}}` in the final request header.

The `Topic Rotation Engine` uses these backend-supported topics, including alias-backed topics:

- `gamer-names`
- `valorant-sweaty`
- `valorant-usernames`
- `roblox-names`
- `roblox-tryhard`
- `fortnite-sweaty`
- `league-of-legends`
- `discord-usernames`

Replace each `<PINTEREST_BOARD_ID_...>` placeholder in `Topic Rotation Engine` with the intended Pinterest board ID inside n8n. Do not commit real board IDs or secrets back to the repo.

## Vercel Environment

The deployed API needs these Vercel environment variables:

- `PINTEREST_ACCESS_TOKEN`
- `PINTEREST_AUTOMATION_SECRET`

The value of `PINTEREST_AUTOMATION_SECRET` in n8n must match the Vercel value. Do not store either value in this repository.

## One-Pin Smoke

1. Import the workflow and keep it inactive.
2. Configure OpenAI, Cloudinary, `PINTEREST_AUTOMATION_SECRET`, and the board ID placeholders in n8n.
3. For a controlled smoke, temporarily configure `Topic Rotation Engine` in n8n so only one topic can be selected, preferably a test board/topic.
4. Click **Execute workflow** once.
5. Confirm the `Publish Direct` node returns a successful response and a Pinterest pin URL or ID.
6. Revert any temporary n8n-only smoke changes before enabling broader rotation.

Do not run a smoke from this repository. The smoke is a manual n8n operation and will publish one pin if the gateway and Pinterest credentials are valid.

## Error Guide

- `401 automation_unauthorized`: the gateway automation header is missing or wrong. Check `X-TryhardNames-Automation-Secret` in `Publish Direct` and confirm n8n `PINTEREST_AUTOMATION_SECRET` matches Vercel.
- `401 unauthorized` from Pinterest config: the backend reached the Pinterest integration path, but the Pinterest access token/config is missing, expired, or rejected. Check Vercel `PINTEREST_ACCESS_TOKEN`.
- `400` invalid body: the final JSON body is missing or has invalid `boardId`, `title`, `description`, `imageUrl`, or `link`. Check the `Merge` output and the `Publish Direct` JSON body.
- `502 publish_failed`: the gateway called downstream Pinterest and publishing failed. Inspect backend logs and the Pinterest response for board ID, token scope, rate limit, or image fetch issues.
