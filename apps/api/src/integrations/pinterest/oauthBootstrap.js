/**
 * Manual OAuth bootstrap: optionally echo the raw access_token once in the callback JSON
 * so operators can copy it into PINTEREST_ACCESS_TOKEN. No persistence here.
 *
 * Set PINTEREST_OAUTH_BOOTSTRAP_EXPOSE_TOKEN=true (or 1) during initial setup.
 * After the first successful POST /publish in this process, raw tokens are no longer returned
 * from the callback (until the process restarts). Unset the env var when finished.
 */

let bootstrapPublishSucceededThisProcess = false;

function envBootstrapExposeEnabled() {
  const v = (process.env.PINTEREST_OAUTH_BOOTSTRAP_EXPOSE_TOKEN || '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

export function isPinterestOAuthBootstrapTokenExposureActive() {
  return envBootstrapExposeEnabled() && !bootstrapPublishSucceededThisProcess;
}

export function markPinterestBootstrapPublishSucceeded() {
  bootstrapPublishSucceededThisProcess = true;
}
