# Hosted osu! linking

This flow is separate from the localhost probe and from Parent Auth.
It requires an authenticated, private Passport and explicit confirmation
after the provider callback. It reuses the existing osu.private.v1 account
and proof format; saved accounts remain readable when linking is disabled.

## Production configuration

Configure only on Vercel project tryhard-names-web, Production:

- OSU_LINKING_ENABLED=true
- OSU_APP_ORIGIN=https://www.tryhardnames.com
- OSU_CLIENT_ID and OSU_CLIENT_SECRET from the registered osu! application
- OSU_COOKIE_KEY: independent random 32-byte key, hexadecimal
- OSU_PASSPORT_DATABASE_URL: TLS connection as osu_linking_writer
- OSU_PASSPORT_API_URL and OSU_PASSPORT_PUBLIC_KEY: the Passport Supabase project

Registered callback:
https://www.tryhardnames.com/api/v1/integrations/osu/callback

The current application is reused. Its localhost callback cannot be used
at the same time unless the provider configuration permits it.
Do not change Preview, local credentials, or Roblox configuration.
Never place server secrets in VITE variables or tracked files.

Apply only 20261015061942_osu_production_linking.sql after the existing
Passport core and osu! private persistence migrations. Provision the
osu_linking_writer login password separately. Do not push unrelated
historical migrations or reset the database.

## Security and verification

- Encrypted HttpOnly/Secure/SameSite=Lax cookie, random state and five-minute expiry.
- Server-side attempt transitions bind owner, active parent session and Passport.
- Exact Origin and X-Passport-Link checks on mutations; persistent start throttling.
- Callback is claimed once before exchanging the code.
- Scopes identify/public; own profile only; restricted accounts rejected.
- Access is revoked before staging the allowlisted snapshot. No provider tokens stored.
- Complete requires the same parent session. Cancel clears pending data.
- Unlink revokes the saved account/proofs and invalidates prior attempts.
- Private table, RLS-bound executor and EXECUTE-only production writer.

Run npm run test:osu:linking and npm run test:osu:db from apps/api.
The database test uses an isolated ephemeral Docker PostgreSQL instance.
Real provider consent must be tested by the account owner after deployment.

To disable new linking, set OSU_LINKING_ENABLED=false and redeploy.
Do not delete saved accounts or roll back the additive schema.
