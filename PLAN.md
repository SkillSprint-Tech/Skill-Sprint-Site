# SkillSprint — Workshops, Email Pipeline & Admin Panel

**Status:** Plan — not started
**Date:** 2026-08-24

---

## 0. Decisions locked

| Question | Decision |
|---|---|
| Hosting plan | Vercel **Hobby** (free) — crons are daily-only, so the 6-hourly retry runs from an external pinger |
| Workshop content | **Neon Postgres + admin CRUD** — no redeploy to change the schedule |
| Redesign depth | **Visual polish, structure preserved** on the six secondary pages |
| Registration unit | **Whole series** — one signup, email carries the full schedule |

## 0.1 Inputs still needed from you

These block specific tasks; everything else can proceed without them.

1. **Real social URLs** — Instagram handle, LinkedIn company page, WhatsApp group invite link.
2. **Sending domain** — e.g. `workshops@skillsprint.tech`. Required before any real email goes out (see §6.6).
3. ~~Current `DB_URI`~~ — **Resolved.** CockroachDB is removed entirely. Neon is the single database for every feature, `team_members` included.
4. **Workshop seed data** — titles, dates, speakers for the first batch, so the page ships with real content rather than placeholders.

---

## 1. Where the codebase actually stands

Verified by reading the repo, not assumed.

- **Stack:** Vue 3 `<script setup>`, Vite 8, Tailwind 4, vue-router 5, GSAP + ScrollTrigger.
- **API:** Vercel serverless functions in `api/`. `vite.config.js` has a `vercelApiPlugin` that maps `/api/<name>` to `api/<name>.js` locally, so new routes need no config change.
- **DB access:** `api/team-members.js` uses `pg` with a pool cached on `globalThis`. Reusable pattern.
- **Design language:** `#F8FAFC` grounds, `blue-600` accent, extrabold `tracking-tight` headings, `rounded-2xl` cards, Handlee cursive floating tags, GSAP scroll reveals via `useGSAP`.

### 1.1 Dead code found

`src/views/Community.vue`, `src/views/Sprints.vue`, and `src/views/Team.vue` are **not imported anywhere** — the router loads `CommunityView.vue`, `SprintsView.vue`, `TeamView.vue`. Both `ContactForm.vue` copies are also unreferenced.

This matters: **every Discord reference on the site lives in those dead files.** The live pages have no Discord mention at all. So the WhatsApp work is *additive* (put a WhatsApp CTA on the live Community page), not a find-and-replace.

### 1.2 Two local-dev bugs in the API plugin

Both need fixing before the admin panel works locally:

- `vite.config.js` parses request bodies only for `POST` and `PUT`. `PATCH` and `DELETE` bodies are dropped — admin CRUD needs both.
- The plugin never populates `req.query`. `api/team-members.js:97` reads `req.query?.id`, which is always `undefined` in local dev. Works on Vercel, silently broken locally.

---

## 2. Phase 0 — Foundations

*~half a day. Everything else builds on this.*

- `src/data/site.js` — single source of truth for social links, WhatsApp invite, contact email, site URL. Every component imports from here so a URL change is one edit.
- `api/_db.js` — extract the pooled `pg` client from `team-members.js`; shared by all new routes.
- `api/_json.js` — small helper for consistent `{ ok, data, error }` responses + CORS.
- Fix the two `vite.config.js` bugs from §1.2 (`PATCH`/`DELETE` bodies, `req.query` population).
- Add `resend` to `package.json`. Brevo is called over plain REST — no second SDK.
- `.env.example` committed with every key name (no values).

---

## 3. Phase 1 — Socials and WhatsApp

*~half a day.*

Target state: **Instagram and LinkedIn only.** No TikTok, no YouTube. WhatsApp group replaces Discord everywhere.

| File | Change |
|---|---|
| `src/components/LandingPage/Footer.vue:36-38` | Icon row: drop TikTok + YouTube, add LinkedIn |
| `src/components/LandingPage/Footer.vue:73-79` | "Follow" column: Instagram + LinkedIn, driven from `site.js` |
| `src/components/LandingPage/Footer.vue` "Connect" | Add **Join WhatsApp Group** link |
| `src/views/CommunityView.vue` | New WhatsApp community CTA section, styled to match the existing dark section pattern |
| `src/views/Community.vue`, `Sprints.vue`, `Team.vue` | **Delete** — dead files, and the only Discord copy in the repo |
| `src/components/ContactForm.vue`, `LandingPage/ContactForm.vue` | Verify unused, then delete |

Font Awesome 6.5.1 is already loaded in `index.html`, so `fa-linkedin-in` and `fa-whatsapp` work with no new dependency.

---

## 4. Phase 2 — Design polish

*~2–3 days. Touches `/about`, `/initiatives`, `/sprints`, `/community`, `/team`, `/mission` + the new `/workshops`.*

`/` and `/contact-us` stay untouched, per `site_overview.md` and your instruction.

Rather than hand-tuning six pages independently, extract shared primitives first so the polish is systematic and consistent:

- `src/components/ui/SectionHeader.vue` — eyebrow + heading + sub-headline, one spacing rhythm
- `src/components/ui/Eyebrow.vue` — the `[ PROOF OF WORK ]` mono tag from `context.md`
- `src/components/ui/Card.vue` — one border/radius/hover contract
- Reuse the existing `StatusBadge.vue`

Then per page, a fixed checklist:

1. Normalize section padding to `py-16 sm:py-20 md:py-28`
2. Lock headings to one type scale — no more ad-hoc `text-[2.4rem]`
3. Unify card radius, border weight, hover state (`transition-colors duration-200`, per `design.md`)
4. Consistent `blue-600` accent usage — focus rings, live badges, anchors only
5. GSAP reveals through `useGSAP` so nothing can strand content invisible
6. Mobile spacing audit at 375px
7. `focus-visible` rings on every interactive element

**Deliberately not doing:** section reordering or copy rewrites. Structure stays; only the visual layer changes.

---

## 5. Phase 3 — Workshops page and registration

*~2 days.*

### 5.1 Schema

```sql
CREATE TABLE workshops (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  speaker       TEXT,
  speaker_role  TEXT,
  starts_at     TIMESTAMPTZ NOT NULL,
  duration_mins INT DEFAULT 90,
  location      TEXT,
  seats         INT,
  status        TEXT NOT NULL DEFAULT 'upcoming',
  sort_order    INT DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE registrations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  phone         TEXT,
  university    TEXT,
  year_of_study TEXT,
  skill_level   TEXT,
  interests     TEXT[],
  consent       BOOLEAN NOT NULL DEFAULT true,
  source        TEXT,
  ip_hash       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Email is `UNIQUE` and lowercased on write — that alone kills duplicate-registration spam.

### 5.2 Page — `/workshops`

- Hero using the site's existing pattern (floating Handlee tags, extrabold heading, blue eyebrow)
- **Upcoming** grid — date chip, title, speaker, duration, seats left, `StatusBadge`
- **Past sessions** strip — completed workshops as social proof
- Sticky **Register for the series** CTA
- Empty state when no workshops are published, per the `context.md` fallback tone

### 5.3 Registration form

- Fields: name, email, phone, university, year, skill level, interests (multi), consent checkbox
- **Honeypot field** + minimum time-on-form check for bot filtering
- Client-side validation mirroring the `context.md` rules (RFC-compliant email, min-length name)
- `POST /api/register` → validate → insert `registrations` → insert `email_jobs` row → **fire the worker inline, non-blocking**, so the common case is an email in seconds, not on the next cron tick
- Success state confirms the email is on its way and gives the WhatsApp group link

---

## 6. Phase 4 — Email engine

*~2–3 days. This is the hard part; the rest is straightforward.*

### 6.1 Quota reality

| Provider | Free tier | Notes |
|---|---|---|
| Resend | 100/day, 3,000/mo | Primary — better deliverability |
| Brevo | ~300/day | Overflow. **Free tier appends Brevo branding to the email** |
| **Combined** | **~400/day** | Matches your 400–500 estimate |

The exact reset boundary for each provider must be verified against their live dashboards before go-live — the whole deferral system depends on knowing when the counter rolls over.

### 6.2 Schema

```sql
CREATE TABLE email_jobs (
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
  UNIQUE (registration_id, template)
);

CREATE TABLE email_quota (
  provider   TEXT NOT NULL,
  quota_date DATE NOT NULL,
  used       INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (provider, quota_date)
);

CREATE TABLE email_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_job_id UUID REFERENCES email_jobs(id) ON DELETE CASCADE,
  provider     TEXT,
  event_type   TEXT,
  payload      JSONB,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

`UNIQUE (registration_id, template)` is the idempotency guarantee — a given person can never be queued the same email twice, no matter how many times the form is submitted or a button is clicked.

### 6.3 Job lifecycle

```
pending ──> processing ──> sent ──> delivered   (webhook confirms receipt)
   ^            │            │
   │            │            └──> bounced       (webhook: hard bounce)
   │            ├──> deferred                   (no quota left — NOT a failure)
   │            └──> failed                     (invalid address / permanent 4xx)
   └────────────┘                               (soft error: backoff, attempts + 1)
```

**`deferred` never increments `attempts`.** Running out of daily quota is an expected condition, not an error — so a queue that sits through three quota-exhausted days doesn't burn its retry budget and give up.

### 6.4 The worker — `api/cron/process-emails.js`

Single code path, shared by the cron and the admin panel's manual send button. That shared path is what keeps the quota ledger honest and makes double-sends impossible.

1. **Authenticate** — require `CRON_SECRET` via `Authorization: Bearer`. Vercel cron sends this header automatically.
2. **Reclaim stuck jobs** — anything `processing` with `locked_at < now() - 15 min` goes back to `pending`.
3. **Claim a batch atomically:**
   ```sql
   UPDATE email_jobs SET status='processing', locked_at=now(), locked_by=$1
   WHERE id IN (
     SELECT id FROM email_jobs
     WHERE status IN ('pending','deferred') AND attempts < 6 AND next_attempt_at <= now()
     ORDER BY created_at
     LIMIT $2
     FOR UPDATE SKIP LOCKED
   ) RETURNING *;
   ```
   `FOR UPDATE SKIP LOCKED` is what makes concurrent cron runs and admin clicks safe.
4. **Read today's remaining quota** per provider.
5. **Per job** — pick Resend if it has headroom, else Brevo. If neither does: set `deferred`, `next_attempt_at` = next reset, unlock, move on. No throw, no `attempts` increment.
6. **On success** — write `status='sent'`, `sent_at`, `provider_message_id`, and increment `email_quota.used` **in the same transaction**.
7. **On provider 429** — record that provider as exhausted for the day, then retry the same job on the other provider.
8. **On hard failure** (invalid address, permanent 4xx) — `failed` + `last_error`, no retry.
9. **On soft failure** (5xx, network) — back to `pending`, `attempts + 1`, exponential backoff into `next_attempt_at`.
10. **Never throw.** Catch everything at the top level, log, return `200` with a JSON summary — a 500 just makes the scheduler hammer a broken endpoint.

**Batch size ~30 per invocation**, concurrency ~5. Vercel Hobby functions cap at 60s (`maxDuration` in `vercel.json`); a bounded batch that drains across repeated runs is safer than one long run that gets killed mid-send.

### 6.5 Email content

- One provider-agnostic template module renders HTML + a plain-text alternative; both providers receive identical output.
- Personalised greeting, then **the full upcoming schedule read from `workshops` at send time** — so someone registering late gets the current schedule, not a stale snapshot.
- `List-Unsubscribe` header and a visible unsubscribe link.
- `.ics` calendar attachment — nice-to-have, defer to Phase 6.

### 6.6 Deliverability — do this before any real send

Sending 400–500 mails/day from an unverified domain gets them spam-foldered or blocked outright, and burns the domain's reputation permanently.

- Verify the sending domain on **both** Resend and Brevo
- Publish **SPF**, **DKIM**, and **DMARC** DNS records
- Send from a real domain address, never a Gmail address
- Warm up: start at low daily volume and ramp

---

## 7. Phase 5 — Admin panel

*~2 days.*

### 7.1 Auth — password only, done safely

- `POST /api/admin/login` with `{ password }` → **timing-safe** compare against `ADMIN_PASSWORD`
- On success, issue an HMAC-SHA256 signed token (12h expiry) as `HttpOnly; Secure; SameSite=Lax` cookie
- `api/_auth.js` exports `requireAdmin(req, res)`; every admin route calls it first
- Login rate limit: 5 attempts per 15 min per hashed IP
- The password **never** reaches the client bundle. The frontend only knows a boolean from `/api/admin/me`
- `/admin` carries `noindex` and is absent from nav and footer

### 7.2 Dashboard

**Summary row:** total registrations · sent · delivered · pending/deferred · failed · today's quota (`Resend 74/100 · Brevo 180/300`) · countdown to reset.

**Registrations table:** name, email, university, registered date, status pill, provider, attempts, last error. Searchable, filterable by status. **Download as CSV** — see §7.4.

**"Not received" view** — the filter that matters. Everything in `pending`, `deferred`, `failed`, or `bounced`, each row with a **Send email** button, plus **Send all pending** for bulk.

**Workshops tab:** full CRUD — create, edit, publish toggle, reorder, delete.

### 7.3 Manual send and the quota toast

`POST /api/admin/send-email { jobId }` runs the *same* `sendOne()` the cron uses.

| Outcome | Response | UI |
|---|---|---|
| Sent | `{ ok: true, provider }` | Green toast — "Sent via Resend" |
| No quota anywhere | `200 { ok: false, code: 'QUOTA_EXHAUSTED', resets_at }` | **Amber toast** — "Daily limit reached (Resend 100/100, Brevo 300/300). Queued — auto-sends after reset in 4h 12m." Job stays `deferred` |
| Hard failure | `{ ok: false, code: 'INVALID_RECIPIENT' }` | Red toast with the reason |

Quota exhaustion returns `200` with a structured code, not a thrown error — exactly the "don't break the sending logic" requirement. The job is left queued and correct; nothing is marked failed for a condition that isn't a failure.

### 7.4 CSV export — download the registration list

`GET /api/admin/export.csv` — admin-auth protected like every other admin route. A **Download CSV** button sits above the registrations table.

**Two modes:**

- **Export current view** — respects whatever search and status filter is active, so "everyone who hasn't received the email" exports as its own list.
- **Export all** — the full registration table regardless of filters.

**Columns:**

```
full_name, email, phone, university, year_of_study, skill_level,
interests, registered_at, email_status, provider, sent_at,
delivered_at, attempts, last_error
```

`interests` is a Postgres array — joined with `; ` into a single cell so Excel doesn't split it across columns.

**Excel correctness — three things that are easy to get wrong:**

1. **UTF-8 BOM prefix** (`﻿`) at the start of the file. Without it, Excel on Windows opens UTF-8 CSV in the legacy codepage and mangles any non-ASCII character — which will hit real student names immediately.
2. **RFC 4180 quoting** — wrap every field in double quotes and escape internal quotes by doubling them. Names with commas, addresses with newlines, and error strings with quotes all break a naive `join(',')`.
3. **CSV formula-injection guard** — prefix any cell whose first character is `=`, `+`, `-`, `@`, tab, or CR with a single quote. Without this, a registrant can type `=HYPERLINK(...)` into the name field and it executes when you open the export in Excel. This is a genuine security issue, not a theoretical one, because the form is public.

**Response headers:**

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="skillsprint-registrations-2026-08-24.csv"
```

**Implementation notes:**

- Stream rows rather than building one big string, so the export doesn't grow into the 60s function limit as the list grows.
- Timestamps exported in ISO 8601 so they sort correctly and parse unambiguously.
- If you later want a true `.xlsx` rather than CSV, that needs a library like `exceljs` and a binary response — worth doing only if you need formatting or multiple sheets. CSV opens natively in Excel, Google Sheets, and Numbers, so it is the right default.

---

## 8. Phase 6 — Scheduling, webhooks, hardening

*~1 day.*

### 8.1 The 6-hourly retry on Hobby

Vercel Hobby crons run **once a day maximum**, so the 6-hour cadence needs a second trigger. Three layers, cheapest first:

1. **Inline trigger on registration** — fire-and-forget call to the worker right after signup. Covers the normal case instantly.
2. **GitHub Actions** — `.github/workflows/email-worker.yml` on `schedule: '0 */6 * * *'`, curling the endpoint with `CRON_SECRET`. Free, and the repo is already on GitHub.
   *Caveat:* scheduled Actions can be delayed under load and are auto-disabled after 60 days of repo inactivity.
3. **Vercel daily cron** in `vercel.json` as the safety net that runs regardless.

If you move to Vercel Pro later, layer 2 collapses into one `vercel.json` line: `"schedule": "0 */6 * * *"`.

### 8.2 Receipt confirmation — sent is not received

A `200` from a provider means **accepted for delivery**, not delivered. Real receipt confirmation only comes from webhooks:

- `api/webhooks/resend.js` and `api/webhooks/brevo.js`, both **signature-verified**
- Update `email_jobs` → `delivered` / `bounced`, append raw payload to `email_events`
- Dashboard shows **Sent** and **Delivered** as separate columns
- Anything stuck at `sent` for 24h+ with no delivery event is flagged **unconfirmed**

This is what makes "who hasn't received it" a real answer rather than a guess.

### 8.3 Hardening

- Rate limit `/api/register` per IP
- Structured logging on every send with job id and provider
- Backfill script to enqueue jobs for any registration missing one
- Runbook in `progress.md`: what to do when quota is exhausted, a provider is down, or a webhook signature fails

---

## 9. Environment variables

```
DB_URI                    # Neon pooled connection string
RESEND_API_KEY
RESEND_FROM               # workshops@yourdomain
BREVO_API_KEY
BREVO_FROM
BREVO_SENDER_NAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET      # long random string for HMAC
CRON_SECRET               # long random string
RESEND_WEBHOOK_SECRET
BREVO_WEBHOOK_SECRET
PUBLIC_SITE_URL
```

---

## 10. Risk register

| # | Risk | Mitigation |
|---|---|---|
| 1 | Hobby cron is daily-only | GitHub Actions pinger + inline trigger (§8.1) |
| 2 | GH Actions auto-disables after 60 days idle | Vercel daily cron as backstop; or cron-job.org |
| 3 | Unverified domain → mail in spam | SPF/DKIM/DMARC before go-live (§6.6) |
| 4 | Provider reset boundary unknown | Verify on both dashboards; store as config, not a hardcoded midnight |
| 5 | Brevo free tier brands the email | Route Resend first; upgrade Brevo if branding is unacceptable |
| 6 | 60s function cap kills a long batch | Bounded batch (~30), drains across runs |
| 7 | Double-send from cron + admin click | `FOR UPDATE SKIP LOCKED` + unique constraint |
| 8 | ~~Mixed database backends~~ | Resolved — Neon is the only database; Cockroach removed |
| 9 | 400/day ceiling vs. a spike in signups | Queue absorbs it; dashboard shows the backlog and drain rate |
| 10 | Local dev API plugin gaps | Fixed in Phase 0 (§1.2) |

---

## 11. Sequence and estimate

| Phase | Work | Est. | Blocks |
|---|---|---|---|
| 0 | Foundations, shared helpers, dev-plugin fixes | 0.5d | — |
| 1 | Socials → Instagram + LinkedIn, WhatsApp, dead-file cleanup | 0.5d | Needs real URLs |
| 2 | Design polish, six pages | 2–3d | — |
| 3 | Workshops page, schema, registration form | 2d | Needs Neon + seed data |
| 4 | Email engine, quota ledger, templates | 2–3d | Needs both API keys + domain |
| 5 | Admin panel, auth, dashboard, CRUD | 2d | Phase 4 |
| 6 | Cron, webhooks, hardening | 1d | Phase 5 |

**Total: roughly 10–12 working days.**

Phases 1 and 2 are fully independent of 3–6, so the design work can run in parallel with the backend if two people are on it.
