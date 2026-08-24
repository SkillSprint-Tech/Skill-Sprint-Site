/**
 * Daily send-quota ledger.
 *
 * Free-tier ceilings. Both providers reset on a UTC day boundary; if you upgrade a plan,
 * change the limit here rather than scattering numbers through the worker.
 */
export const PROVIDER_LIMITS = {
  resend: Number(process.env.RESEND_DAILY_LIMIT || 100),
  brevo: Number(process.env.BREVO_DAILY_LIMIT || 300),
}

/** Priority order. Resend first: better deliverability, and Brevo's free tier brands the email. */
export const PROVIDER_ORDER = ['resend', 'brevo']

export function isConfigured(provider) {
  if (provider === 'resend') return Boolean(process.env.RESEND_API_KEY)
  if (provider === 'brevo') return Boolean(process.env.BREVO_API_KEY)
  return false
}

export function configuredProviders() {
  return PROVIDER_ORDER.filter(isConfigured)
}

/** The UTC date key the counters are bucketed under. */
export function quotaDate(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

/** When today's counters roll over — the moment a deferred job becomes sendable again. */
export function nextResetAt(now = new Date()) {
  const next = new Date(now)
  next.setUTCHours(24, 0, 0, 0)
  return next
}

/**
 * Current usage for every provider, whether configured or not.
 * Returns { resend: { used, limit, remaining, configured }, brevo: {...} }
 */
export async function readUsage(client, now = new Date()) {
  const { rows } = await client.query(
    'SELECT provider, used FROM email_quota WHERE quota_date = $1',
    [quotaDate(now)]
  )
  const used = Object.fromEntries(rows.map((r) => [r.provider, r.used]))

  const out = {}
  for (const provider of PROVIDER_ORDER) {
    const limit = PROVIDER_LIMITS[provider]
    const usedCount = used[provider] ?? 0
    out[provider] = {
      used: usedCount,
      limit,
      remaining: Math.max(0, limit - usedCount),
      configured: isConfigured(provider),
    }
  }
  return out
}

/**
 * Pick the first provider that is configured and still has headroom.
 * Returns null when every provider is exhausted or unconfigured — the caller must treat
 * that as "defer", never as an error.
 */
export function pickProvider(usage, exclude = []) {
  for (const provider of PROVIDER_ORDER) {
    if (exclude.includes(provider)) continue
    const state = usage[provider]
    if (state?.configured && state.remaining > 0) return provider
  }
  return null
}

/**
 * Record one successful send. Called inside the same transaction as the job update so the
 * ledger can never drift from reality.
 */
export async function incrementUsage(client, provider, now = new Date()) {
  await client.query(
    `INSERT INTO email_quota (provider, quota_date, used)
     VALUES ($1, $2, 1)
     ON CONFLICT (provider, quota_date) DO UPDATE SET used = email_quota.used + 1`,
    [provider, quotaDate(now)]
  )
}

/**
 * Mark a provider as fully spent for today. Used when the provider itself returns a
 * rate-limit response — its count is more authoritative than ours.
 */
export async function markExhausted(client, provider, now = new Date()) {
  await client.query(
    `INSERT INTO email_quota (provider, quota_date, used)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider, quota_date) DO UPDATE SET used = GREATEST(email_quota.used, $3)`,
    [provider, quotaDate(now), PROVIDER_LIMITS[provider]]
  )
}
