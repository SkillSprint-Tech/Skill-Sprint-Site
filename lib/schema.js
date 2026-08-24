import { getPool } from './db.js'

/**
 * Idempotent schema bootstrap for Neon Postgres.
 *
 * Every statement is CREATE ... IF NOT EXISTS, so this is safe to call on every cold start.
 * It runs at most once per warm instance (guarded by the globalThis flag below) to keep the
 * per-request cost at zero after the first hit.
 *
 * `gen_random_uuid()` is built into Postgres 13+, which Neon runs — no pgcrypto needed.
 */
const STATEMENTS = [
  // ── Team roster ──────────────────────────────────────────────────────────────
  // Backs /team and the hidden /team-form.
  `CREATE TABLE IF NOT EXISTS team_members (
     id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name       TEXT NOT NULL,
     role       TEXT NOT NULL,
     bio        TEXT NOT NULL,
     focus      TEXT[] NOT NULL DEFAULT ARRAY['Core Builder', 'Collaborator'],
     image      TEXT NOT NULL DEFAULT '',
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  // ── Workshops ────────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS workshops (
     id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title         TEXT NOT NULL,
     description   TEXT NOT NULL DEFAULT '',
     speaker       TEXT NOT NULL DEFAULT '',
     speaker_role  TEXT NOT NULL DEFAULT '',
     starts_at     TIMESTAMPTZ NOT NULL,
     duration_mins INT NOT NULL DEFAULT 90,
     location      TEXT NOT NULL DEFAULT 'Online',
     seats         INT,
     status        TEXT NOT NULL DEFAULT 'upcoming',
     sort_order    INT NOT NULL DEFAULT 0,
     is_published  BOOLEAN NOT NULL DEFAULT true,
     created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS workshops_schedule_idx
     ON workshops (is_published, starts_at)`,
  // The join link. Deliberately a separate column from `location`: it is NEVER returned by
  // the public /api/workshops response, only sent by email to people who registered.
  `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS meeting_link TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS link_sent_at TIMESTAMPTZ`,

  // ── Registrations ────────────────────────────────────────────────────────────
  // email is UNIQUE and lowercased on write, which is the whole duplicate-signup defence.
  `CREATE TABLE IF NOT EXISTS registrations (
     id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     full_name     TEXT NOT NULL,
     email         TEXT NOT NULL UNIQUE,
     phone         TEXT NOT NULL DEFAULT '',
     university    TEXT NOT NULL DEFAULT '',
     year_of_study TEXT NOT NULL DEFAULT '',
     skill_level   TEXT NOT NULL DEFAULT '',
     interests     TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
     consent       BOOLEAN NOT NULL DEFAULT true,
     source        TEXT NOT NULL DEFAULT '',
     ip_hash       TEXT NOT NULL DEFAULT '',
     created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS registrations_created_idx
     ON registrations (created_at DESC)`,
  // Unsubscribes. A row is kept rather than deleted so we never re-email someone who
  // opted out, and so the admin panel can show why they stopped receiving mail.
  `ALTER TABLE registrations ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ`,
  // Abuse control on the public form.
  `CREATE INDEX IF NOT EXISTS registrations_ip_idx
     ON registrations (ip_hash, created_at DESC)`,

  // ── Email queue ──────────────────────────────────────────────────────────────
  // UNIQUE (registration_id, template) is the idempotency guarantee: a person can never be
  // queued the same email twice, no matter how many times a button is clicked.
  `CREATE TABLE IF NOT EXISTS email_jobs (
     id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     registration_id     UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
     template            TEXT NOT NULL DEFAULT 'welcome_schedule',
     status              TEXT NOT NULL DEFAULT 'pending',
     provider            TEXT,
     provider_message_id TEXT,
     attempts            INT NOT NULL DEFAULT 0,
     last_error          TEXT,
     next_attempt_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
     sent_at             TIMESTAMPTZ,
     delivered_at        TIMESTAMPTZ,
     locked_at           TIMESTAMPTZ,
     locked_by           TEXT,
     created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
     CONSTRAINT email_jobs_unique_per_template UNIQUE (registration_id, template)
   )`,
  // Drives the worker's claim query.
  `CREATE INDEX IF NOT EXISTS email_jobs_claimable_idx
     ON email_jobs (status, next_attempt_at)`,

  // ── Daily quota ledger ───────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS email_quota (
     provider   TEXT NOT NULL,
     quota_date DATE NOT NULL,
     used       INT  NOT NULL DEFAULT 0,
     PRIMARY KEY (provider, quota_date)
   )`,

  // ── Webhook audit trail ──────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS email_events (
     id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email_job_id UUID REFERENCES email_jobs(id) ON DELETE CASCADE,
     provider     TEXT NOT NULL DEFAULT '',
     event_type   TEXT NOT NULL DEFAULT '',
     payload      JSONB,
     occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  // ── Login throttling ─────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS admin_login_attempts (
     id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     ip_hash    TEXT NOT NULL,
     succeeded  BOOLEAN NOT NULL DEFAULT false,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS admin_login_attempts_idx
     ON admin_login_attempts (ip_hash, created_at DESC)`,
]

export async function ensureSchema() {
  if (globalThis.__ssSchemaReady) return
  const pool = getPool()
  for (const statement of STATEMENTS) {
    await pool.query(statement)
  }
  globalThis.__ssSchemaReady = true
}

/** Force the next ensureSchema() call to run again. Used by the migration script. */
export function resetSchemaCache() {
  globalThis.__ssSchemaReady = false
}
