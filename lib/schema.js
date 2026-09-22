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
  `ALTER TABLE team_members ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0`,

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

  // ── Certificates ─────────────────────────────────────────────────────────────
  // One template per workshop: the Canva export plus where and how the name is drawn.
  `CREATE TABLE IF NOT EXISTS certificate_templates (
     workshop_id     UUID PRIMARY KEY REFERENCES workshops(id) ON DELETE CASCADE,
     canva_url       TEXT NOT NULL DEFAULT '',
     canva_design_id TEXT NOT NULL DEFAULT '',
     canva_title     TEXT NOT NULL DEFAULT '',
     pdf             BYTEA,
     preview_png     BYTEA,
     page_width      REAL,
     page_height     REAL,
     page_count      INT,
     fetched_at      TIMESTAMPTZ,
     font            BYTEA,
     font_filename   TEXT NOT NULL DEFAULT '',
     font_family     TEXT NOT NULL DEFAULT '',
     name_x          REAL,
     name_y          REAL,
     name_size       REAL NOT NULL DEFAULT 36,
     name_color      TEXT NOT NULL DEFAULT '#111827',
     name_max_width  REAL NOT NULL DEFAULT 0.6,
     created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  // Attendees, per workshop. Deliberately separate from registrations: reminders go to every
  // registration, and walk-in attendees never asked for those.
  `CREATE TABLE IF NOT EXISTS certificate_recipients (
     id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
     full_name   TEXT NOT NULL,
     email       TEXT NOT NULL,
     source      TEXT NOT NULL DEFAULT '',
     created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
     CONSTRAINT certificate_recipients_unique UNIQUE (workshop_id, email)
   )`,
  // A job now belongs to a registration OR a certificate recipient. Guarded so a warm
  // start does not take a table lock for a change that is already in place.
  `DO $$ BEGIN
     IF EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'email_jobs' AND column_name = 'registration_id'
                   AND is_nullable = 'NO') THEN
       ALTER TABLE email_jobs ALTER COLUMN registration_id DROP NOT NULL;
     END IF;
   END $$`,
  `ALTER TABLE email_jobs ADD COLUMN IF NOT EXISTS certificate_recipient_id UUID
     REFERENCES certificate_recipients(id) ON DELETE CASCADE`,
  `DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_jobs_one_recipient') THEN
       ALTER TABLE email_jobs ADD CONSTRAINT email_jobs_one_recipient
         CHECK ((registration_id IS NULL) <> (certificate_recipient_id IS NULL));
     END IF;
   END $$`,
  // One certificate job per attendee per workshop, however often Send is clicked.
  `CREATE UNIQUE INDEX IF NOT EXISTS email_jobs_unique_certificate
     ON email_jobs (certificate_recipient_id, template)
     WHERE certificate_recipient_id IS NOT NULL`,

  // ── Canva connection ─────────────────────────────────────────────────────────
  // A single row. Tokens are AES-GCM sealed (lib/canva/tokenCrypto.js).
  `CREATE TABLE IF NOT EXISTS canva_connection (
     id            INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
     access_token  TEXT NOT NULL,
     refresh_token TEXT NOT NULL,
     expires_at    TIMESTAMPTZ NOT NULL,
     scope         TEXT NOT NULL DEFAULT '',
     display_name  TEXT NOT NULL DEFAULT '',
     connected_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  // Short-lived PKCE verifiers, keyed by the OAuth state. Single use.
  `CREATE TABLE IF NOT EXISTS canva_oauth_states (
     state         TEXT PRIMARY KEY,
     code_verifier TEXT NOT NULL,
     redirect_uri  TEXT NOT NULL,
     created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,

  // ── Certificate Verification ──────────────────────────────────────────────────
  `ALTER TABLE certificate_recipients ADD COLUMN IF NOT EXISTS verification_code VARCHAR(32)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS certificate_recipients_code_idx
     ON certificate_recipients (verification_code) WHERE verification_code IS NOT NULL`,
  `ALTER TABLE certificate_recipients ADD COLUMN IF NOT EXISTS issued_at TIMESTAMPTZ DEFAULT now()`,

  // ── Workshop Check-in ────────────────────────────────────────────────────────
  `ALTER TABLE registrations ADD COLUMN IF NOT EXISTS attended BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ`,
  `CREATE INDEX IF NOT EXISTS registrations_attended_idx ON registrations (attended)`,

  // ── Workshop Reminders & Resource Hub ─────────────────────────────────────────
  `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS reminder_24h_sent_at TIMESTAMPTZ`,
  `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS reminder_1h_sent_at TIMESTAMPTZ`,
  `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS recording_url TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS slides_url TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS repo_url TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE workshops ADD COLUMN IF NOT EXISTS resources_notes TEXT NOT NULL DEFAULT ''`,

  // ── Attendee Portal Passwordless OTPs ─────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS attendee_otps (
     email       TEXT PRIMARY KEY,
     otp_code    TEXT NOT NULL,
     expires_at  TIMESTAMPTZ NOT NULL,
     attempts    INT NOT NULL DEFAULT 0,
     created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
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
