import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, Eye, EyeOff, Link2, Loader2, LockKeyhole, RefreshCw, ShieldCheck, Unlink } from 'lucide-react';
import {
  createOsuLinkIntent,
  getOsuRuntimeOverview,
  getOsuRuntimeStatus,
  getParentAuthBearer,
  setOsuProofVisibility,
  unlinkOsuProvider,
} from '@/gaming-passport/data/osuRuntimeRepository.js';

const CONNECTED_STATUSES = new Set(['verified']);

export default function OsuProviderLinkingCard({ passport, session, isPassportLoading = false }) {
  const [runtime, setRuntime] = useState(null);
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isConfirmingUnlink, setIsConfirmingUnlink] = useState(false);
  const [isConfirmingPublic, setIsConfirmingPublic] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const passportId = passport?.id || '';
  const parentBearer = getParentAuthBearer(session);
  const activeConnection = useMemo(() => selectActiveConnection(connections), [connections]);
  const latestConnection = connections[0] || null;
  const isRuntimeConfigured = runtime?.configured === true || runtime?.status === 'configured';
  const isConnected = activeConnection?.status && CONNECTED_STATUSES.has(activeConnection.status);
  const canConnect = Boolean(isRuntimeConfigured && passportId && parentBearer && !isConnected && !isPassportLoading);
  const canDisconnect = Boolean(isRuntimeConfigured && passportId && parentBearer && isConnected && activeConnection?.id);
  const proofVisibilityModel = buildProofVisibilityModel({
    passport,
    activeConnection,
    latestConnection,
    isRuntimeConfigured,
    isConnected,
    isPassportLoading,
    passportId,
    parentBearer,
  });
  const statusModel = buildStatusModel({
    runtime,
    latestConnection,
    activeConnection,
    isRuntimeConfigured,
    isConnected,
    proofVisibility: proofVisibilityModel.visibility,
    isPassportLoading,
  });

  const refreshStatus = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      setIsLoading(true);
      setError('');
      try {
        const overview = await getOsuRuntimeOverview();
        if (!isMounted) return;
        const nextRuntime = overview.runtime || {};
        setRuntime(nextRuntime);

        if ((nextRuntime.configured === true || nextRuntime.status === 'configured') && passportId && parentBearer) {
          const ownerStatus = await getOsuRuntimeStatus({ accessToken: parentBearer, passportId });
          if (!isMounted) return;
          setConnections(ownerStatus.connections || []);
        } else if (isMounted) {
          setConnections([]);
        }
      } catch {
        if (!isMounted) return;
        setConnections([]);
        setError('Could not load osu! provider status.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, [parentBearer, passportId, refreshKey]);

  async function handleConnect() {
    if (!canConnect) return;
    setMessage('');
    setError('');
    setIsConnecting(true);
    try {
      const intent = await createOsuLinkIntent({ accessToken: parentBearer, passportId });
      const authorizeUrl = validateAuthorizeUrl(intent.authorizeUrl);
      if (typeof window !== 'undefined') {
        window.location.assign(authorizeUrl);
      }
    } catch {
      setError('Could not start osu! linking. Refresh and try again from this private account page.');
      setIsConnecting(false);
    }
  }

  async function handleConfirmUnlink() {
    if (!canDisconnect) return;
    setMessage('');
    setError('');
    setIsUnlinking(true);
    try {
      await unlinkOsuProvider({
        accessToken: parentBearer,
        passportId,
        linkedProviderAccountId: activeConnection.id,
      });
      setIsConfirmingUnlink(false);
      setMessage('osu! was disconnected. The private proof is revoked and public serving is blocked.');
      refreshStatus();
    } catch {
      setError('Could not disconnect osu! for this Passport.');
    } finally {
      setIsUnlinking(false);
    }
  }

  async function handleSetProofVisibility(nextVisibility) {
    if (!proofVisibilityModel.canUpdate) return;
    if (nextVisibility === 'public' && !proofVisibilityModel.canMakePublic) return;
    if (nextVisibility === 'private' && !proofVisibilityModel.canMakePrivate) return;
    setMessage('');
    setError('');
    setIsUpdatingVisibility(true);
    try {
      const result = await setOsuProofVisibility({
        accessToken: parentBearer,
        passportId,
        linkedProviderAccountId: activeConnection.id,
        visibility: nextVisibility,
      });
      setIsConfirmingPublic(false);
      setMessage(nextVisibility === 'public'
        ? `osu! proof visibility is set to public preference. Public projection remains blocked by ${result.projectionEligibility.reason || 'policy gates'} until the next smoke milestone.`
        : 'osu! proof visibility is private again and cannot serve publicly.');
      refreshStatus();
    } catch {
      setError('Could not update osu! proof visibility for this Passport.');
    } finally {
      setIsUpdatingVisibility(false);
    }
  }

  return (
    <section id="osu-owner-linking" className="rounded-lg border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">osu! linked provider</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Private owner connection</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-200">
            osu! is a linked provider, not Parent Auth. TryhardNames verifies ownership with osu!, keeps the proof private by default, stores no refresh tokens, and does not represent official endorsement by osu!.
          </p>
        </div>
        <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusModel.badgeClass}`}>
          {statusModel.icon}
          {statusModel.label}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.75fr)]">
        <div className="rounded-lg border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Connection status</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{statusModel.detail}</p>
            </div>
            <button
              type="button"
              onClick={refreshStatus}
              disabled={isLoading}
              className="inline-flex min-h-9 w-fit items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Refresh
            </button>
          </div>

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatusField label="Provider" value="osu!" />
            <StatusField label="Visibility" value={activeConnection?.visibility || latestConnection?.visibility || 'private by default'} />
            <StatusField label="Proof visibility" value={proofVisibilityModel.visibilityLabel} />
            <StatusField label="Display name" value={activeConnection?.displayName || latestConnection?.displayName || 'Not connected'} />
            <StatusField label="Verified" value={formatDate(activeConnection?.verifiedAt || latestConnection?.verifiedAt)} />
            <StatusField label="Revoked" value={formatDate(latestConnection?.revokedAt)} />
            <StatusField label="Stale" value={formatDate(latestConnection?.staleAt)} />
          </dl>

          {activeConnection?.profileUrl && (
            <a
              href={activeConnection.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              View osu! profile
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}

          {message && (
            <p className="mt-4 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">
              {error}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Owner actions</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
            Connect opens the server-generated authorization flow in this tab. Disconnect retires the private ownership proof from TryhardNames and blocks public serving.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            {!isConnected && (
              <button
                type="button"
                onClick={handleConnect}
                disabled={!canConnect || isConnecting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-white/10 dark:disabled:text-slate-400"
              >
                {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
                Connect osu!
              </button>
            )}

            {isConnected && !isConfirmingUnlink && (
              <button
                type="button"
                onClick={() => setIsConfirmingUnlink(true)}
                disabled={!canDisconnect || isUnlinking}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-400/40 dark:text-red-100 dark:hover:bg-red-500/10"
              >
                <Unlink className="h-4 w-4" aria-hidden="true" />
                Disconnect osu!
              </button>
            )}

            {isConnected && (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  {proofVisibilityModel.visibility === 'public'
                    ? <Eye className="h-4 w-4 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
                    : <EyeOff className="h-4 w-4 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />}
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">Proof visibility</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-700 dark:text-slate-200">
                  Private: only you can see this proof. Public: eligible to appear on your public Gaming Passport only if your Passport is published, publication consent is active, and every policy gate passes.
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                  {proofVisibilityModel.detail}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {proofVisibilityModel.visibility !== 'public' && !isConfirmingPublic && (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingPublic(true)}
                      disabled={!proofVisibilityModel.canMakePublic || isUpdatingVisibility}
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-cyan-300 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-300/40 dark:text-cyan-100 dark:hover:bg-cyan-300/10"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      Make Public
                    </button>
                  )}

                  {proofVisibilityModel.visibility === 'public' && (
                    <button
                      type="button"
                      onClick={() => handleSetProofVisibility('private')}
                      disabled={!proofVisibilityModel.canMakePrivate || isUpdatingVisibility}
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                    >
                      {isUpdatingVisibility ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />}
                      Make Private
                    </button>
                  )}
                </div>

                {isConfirmingPublic && (
                  <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                    <p className="text-sm font-semibold">Make this osu! proof public eligible?</p>
                    <p className="mt-1 text-xs leading-5">
                      This records your owner visibility preference only. TryhardNames still blocks automatic public projection until the projection allowlist and smoke QA pass.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetProofVisibility('public')}
                        disabled={!proofVisibilityModel.canMakePublic || isUpdatingVisibility}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdatingVisibility ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
                        Confirm Public
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingPublic(false)}
                        disabled={isUpdatingVisibility}
                        className="inline-flex min-h-9 items-center justify-center rounded-md border border-amber-400/60 px-3 py-1.5 text-xs font-semibold transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-amber-500/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isConfirmingUnlink && (
              <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                <p className="text-sm font-semibold">Disconnect osu! from this Passport?</p>
                <p className="mt-1 text-xs leading-5">
                  The linked provider account and profile proof stay private, move to revoked, and stop serving publicly in TryhardNames.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmUnlink}
                    disabled={isUnlinking}
                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUnlinking ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Unlink className="h-3.5 w-3.5" aria-hidden="true" />}
                    Disconnect
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingUnlink(false)}
                    disabled={isUnlinking}
                    className="inline-flex min-h-9 items-center justify-center rounded-md border border-amber-400/60 px-3 py-1.5 text-xs font-semibold transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-amber-500/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isRuntimeConfigured && (
            <p className="mt-4 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              The local runtime is disabled or not configured, so Connect osu! stays unavailable.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function StatusField({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">{value || 'None'}</dd>
    </div>
  );
}

function selectActiveConnection(connections) {
  return connections.find((connection) => connection.status === 'verified' && ['private', 'public'].includes(connection.visibility))
    || connections.find((connection) => connection.status === 'stale')
    || null;
}

function buildProofVisibilityModel({
  passport,
  activeConnection,
  latestConnection,
  isRuntimeConfigured,
  isConnected,
  isPassportLoading,
  passportId,
  parentBearer,
}) {
  const connection = activeConnection || latestConnection;
  const proof = connection?.proof || null;
  const visibility = proof?.visibility || connection?.visibility || 'private';
  const isProviderCurrent = Boolean(
    connection?.status === 'verified' &&
      !connection?.revokedAt &&
      !connection?.staleAt
  );
  const isProofCurrent = Boolean(
    proof?.status === 'current' &&
      !proof?.revokedAt &&
      !proof?.staleAt
  );
  const isPassportPublished = passport?.status === 'published';
  const hasPublicationConsent = passport?.publicationConsent === true;
  const isPassportPublicReady = isPassportPublished && hasPublicationConsent;
  const canUpdate = Boolean(
    isRuntimeConfigured &&
      isConnected &&
      passportId &&
      parentBearer &&
      activeConnection?.id &&
      isProviderCurrent &&
      isProofCurrent &&
      !isPassportLoading
  );

  let detail = 'Connect osu! before changing proof visibility.';
  if (!isRuntimeConfigured) {
    detail = 'Proof visibility is disabled because the osu! runtime is not configured.';
  } else if (!isConnected) {
    detail = 'No current osu! proof is connected yet.';
  } else if (!isProviderCurrent) {
    detail = 'The linked provider is revoked or stale, so this proof cannot be made public.';
  } else if (!isProofCurrent) {
    detail = 'The profile proof is revoked or stale, so visibility changes are blocked.';
  } else if (!isPassportPublicReady) {
    detail = 'Publish the Passport and enable publication consent before this proof can be marked public. Public projection remains blocked until then.';
  } else if (visibility === 'public') {
    detail = 'Owner visibility is public, but public projection remains gated until RM-33 projection smoke passes.';
  } else {
    detail = 'Owner visibility is private. Making it public records your preference but does not bypass projection gates.';
  }

  return {
    visibility,
    visibilityLabel: visibility === 'public' ? 'public preference' : 'private',
    detail,
    canUpdate,
    canMakePublic: canUpdate && visibility !== 'public' && isPassportPublicReady,
    canMakePrivate: canUpdate && visibility === 'public',
  };
}

function buildStatusModel({
  runtime,
  latestConnection,
  activeConnection,
  isRuntimeConfigured,
  isConnected,
  proofVisibility,
  isPassportLoading,
}) {
  if (isPassportLoading) {
    return {
      label: 'Loading Passport',
      detail: 'Waiting for the private Passport draft before checking osu! owner status.',
      badgeClass: 'border-slate-300 bg-slate-50 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-slate-200',
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />,
    };
  }

  if (!runtime) {
    return {
      label: 'Checking',
      detail: 'Checking the private osu! runtime status.',
      badgeClass: 'border-slate-300 bg-slate-50 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-slate-200',
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />,
    };
  }

  if (!isRuntimeConfigured) {
    return {
      label: 'Not configured',
      detail: 'The server-side osu! runtime is disabled or missing configuration.',
      badgeClass: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100',
      icon: <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />,
    };
  }

  if (isConnected) {
    return {
      label: proofVisibility === 'public' ? 'Connected public preference' : 'Connected private',
      detail: proofVisibility === 'public'
        ? 'This Passport has a verified osu! proof with owner public preference, while projection remains gated.'
        : 'This Passport has a verified private osu! ownership proof.',
      badgeClass: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100',
      icon: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
    };
  }

  if (activeConnection?.status === 'stale' || latestConnection?.status === 'failed') {
    return {
      label: 'Needs attention',
      detail: 'The previous osu! link is stale or failed. Start a fresh private connection when ready.',
      badgeClass: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100',
      icon: <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />,
    };
  }

  if (latestConnection?.status === 'revoked') {
    return {
      label: 'Disconnected',
      detail: 'osu! was disconnected and the TryhardNames proof is revoked.',
      badgeClass: 'border-slate-300 bg-slate-50 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-slate-200',
      icon: <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />,
    };
  }

  return {
    label: 'Ready',
    detail: 'The server-side osu! runtime is configured and ready for a private owner link.',
    badgeClass: 'border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-cyan-50',
    icon: <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />,
  };
}

function validateAuthorizeUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('invalid_authorize_url');
  return url.toString();
}

function formatDate(value) {
  if (!value) return 'None';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'None';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
