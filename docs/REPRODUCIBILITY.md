# Reproducibility and Repository Hygiene

## Runtime

- Node.js: use the version in `.nvmrc` (`20.19.1`).
- npm: use the npm version bundled with that Node.js runtime.
- Do not use checked-in `node_modules` folders or dependency folders copied from ZIP archives.

## Clean Install

```bash
npm ci
npm run lint
npm test
npm run test:api
npm run test:seo
npm run build
```

## Required Local Environment Variables

Create local `.env` files only from `.env.example` templates. Never commit real values.

API:

- `PORT`
- `CORS_ORIGIN`

Web:

- No variable is required for the default static build.

## Files That Must Stay Local

- `node_modules/`
- `dist/` and `**/dist/`
- `.vercel/`
- `.env` and `.env.*`, except `.env.example`
- `apps/pocketbase/pb_data/`
- `apps/pocketbase/pb_snapshots/`
- `apps/pocketbase/pocketbase`
- `*.db`, `*.db-shm`, `*.db-wal`, `*.sqlite`, `*.sqlite3`
- generated archives such as `*.tar.gz`

## Credential Rotation

If any real local `.env` value was shared, uploaded, or previously committed, rotate it in the owning provider before using it again. Do not paste secrets into issues, logs, docs, CI output, or chat.
