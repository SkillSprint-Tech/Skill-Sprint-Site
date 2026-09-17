# Workshop Certificates — Design

**Status:** Approved (flow reviewed 2026-09-17)
**Branch:** `feature/workshop-certificates`

Send each workshop attendee a personalised PDF certificate by email, from the admin panel,
using the Canva designs the team already made and the attendance sheets already collected.

---

## 1. Decisions

| Question | Decision |
|---|---|
| Canva plan | Free/Pro. Canva Autofill is Enterprise-only, so names are drawn onto the exported PDF by our server. |
| Template source | Paste the Canva link. The server exports the design through the Canva Connect API (OAuth, the admin's own account). |
| Name area in the designs | The team removes the placeholder text in Canva. The exported PDF must have an empty name area. |
| Per-person fields | Name only. Title, date and signatures are baked into each workshop's design. |
| Name placement | Click on a preview to set the baseline centre point; set size, colour, max width. |
| Font | Uploaded per template (.ttf / .otf). |
| Attendance import | Paste a link-shared Google Sheet (primary) or upload CSV / .xlsx (fallback). |
| Delivery | PDF attached to the email. |
| Unsubscribed people | Still receive their certificate. No unsubscribe link or header on this email. |
| Architecture | Certificates are jobs in the existing `email_jobs` queue (approach A). |

### Known inputs (2026-09-17)

| Workshop | Canva design | Sheet rows |
|---|---|---|
| 1 | `canva.link/9e9xyxpifdtp4ex` → `DAHVYOULcqg` | 58 |
| 2 | `canva.link/q8yb8vyrvwn1509` → `DAHVYCBCOmg` | 51 |
| 3 | `canva.link/g6msos8kjl6zmdy` → `DAHVYD86gwc` | 40 (3 exact duplicates) |
| 4 | `canva.link/a6wqm8cfk0c3tuf` → `DAHVYCRah4Y` | 38 |

All four sheets have the columns `Full Name`, `Email` (sheet 3's header contains an embedded
newline). 187 certificates in total, which fits inside one day of combined free-tier quota.

---

## 2. Admin flow

A new **Certificates** tab in `/admin`.

- **Header:** Canva connection status: "Connected as <name>" with Disconnect, or a Connect Canva button.
- **One card per workshop** (from the `workshops` table), with four steps. Each step shows ✓ when complete:
  1. **Template:** paste the Canva link, then Fetch from Canva. Shows the preview image, page size and file size. Refresh from Canva re-exports the design.
  2. **Name style:**
     - Upload the font.
     - Click the preview to set the baseline centre.
     - Set the size (pt), colour and max width (% of page width).
     - The live preview uses the longest imported name. Download sample returns the real PDF.
  3. **Attendees:**
     - Paste a Sheet link or upload a file.
     - A preview table flags duplicates, odd capitalisation, invalid or missing values, and people already imported. Names are editable in place, and rows can be excluded.
     - Import saves the list. Re-importing only adds people.
     - The saved list supports edit and delete per person.
  4. **Send:**
     - Send test to an address the admin types (remembered locally).
     - Send all opens a confirmation, then queues and drains.
     - Progress shows sent, delivered, waiting and failed counts.
     - Each person has a Resend button.
     - Send all is disabled until steps 1–3 are complete.

The four workshops must exist in the Workshops tab. The existing CRUD there covers creating them.

---

## 3. Canva connection

**Scopes:** `design:meta:read` (title, page count), `design:content:read` (export) and `profile:read` (display name).

**OAuth flow** (authorization code + PKCE S256):

1. The admin clicks Connect. `POST /api/admin/canva {op:'authorize'}` creates a random `state` and a `code_verifier` (64 characters), stores them in `canva_oauth_states`, and returns the Canva authorize URL.
2. The browser navigates to Canva. Canva redirects to `<origin>/admin/canva/callback?code&state`, which is an SPA route rendering `AdminView`. The admin session is an HttpOnly `SameSite=Lax` cookie, so it survives the round trip.
3. `AdminView` sees the callback path and posts `{op:'callback', code, state}`. The server:
   - consumes the state row (single use, 15-minute expiry);
   - exchanges the code at `POST https://api.canva.com/rest/v1/oauth/token` (Basic auth, form body);
   - fetches `GET /v1/users/me/profile`;
   - stores the connection.

   The SPA then replaces the URL with `/admin` and opens the Certificates tab.

**Redirect URI:** `CANVA_REDIRECT_URI` if set. Otherwise it is derived from the request host. It must match a URL registered on the integration:

- production: `https://<site>/admin/canva/callback`
- local: `http://127.0.0.1:5173/admin/canva/callback` (Canva's docs advise `127.0.0.1` over `localhost`)

**Token storage:** a single row in `canva_connection`. Access and refresh tokens are encrypted with AES-256-GCM. The key is derived from `ADMIN_SESSION_SECRET` via HKDF, so no new secret is needed. Rotating that secret simply requires reconnecting.

**Refresh:**
- Access tokens last about 4 hours, and refresh tokens are single-use.
- Refresh happens inside a transaction holding `SELECT … FOR UPDATE` on the connection row, so two concurrent requests can never both spend the same refresh token.
- The token is refreshed when it has fewer than 5 minutes left, or after one 401.

**New env vars:** `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, and the optional `CANVA_REDIRECT_URI`.

### Fetching a template

1. **Resolve the design ID** from the pasted link:
   - `https://www.canva.com/design/<ID>/…` → read the ID directly.
   - `https://canva.link/<slug>` → one manual-redirect `GET`; the `Location` must be a `www.canva.com/design/<ID>/` URL.
   - Any other host is rejected, and the slug must be alphanumeric. Only these two URL shapes are ever fetched, which prevents server-side request forgery.
2. `GET /v1/designs/{id}` returns the title and page count. Only page 1 is used, and there is a warning if there are more pages.
3. `POST /v1/exports {design_id, format:{type:'pdf', pages:[1]}}`, then poll `GET /v1/exports/{id}` every 1.5 seconds, for up to 35 seconds. Download `urls[0]`. The PDF and PNG exports run in parallel so they fit inside a 60-second function.
4. Same again with `{type:'png', pages:[1], width:1600, lossless:false}` for the preview.
5. Read the page size with `pdf-lib`. Store the PDF, PNG, dimensions, design ID, title and fetch time.
6. **Errors become messages the admin can act on:**
   - `permission_denied`: "The connected Canva account can't open this design."
   - `license_required`: "The design uses premium elements this account hasn't licensed."
   - `approval_required`
   - timeout
   - not connected
7. **Size warning** if the PDF is over 4 MB (Vercel's response cap is 4.5 MB, which the sample download is subject to).

---

## 4. Rendering

`lib/certificates/render.js`, a pure function:

```
renderCertificate({ templatePdf, fontBytes, style, name, title }) → Uint8Array
```

- Uses `pdf-lib` with `@pdf-lib/fontkit`. The whole font is embedded, not a subset: pdf-lib's subsetter garbles some fonts.
- **Style fields:**
  - `x` and `y` are fractions (0–1) of the page, measured from the top-left, and give the baseline centre.
  - `size` is in points.
  - `color` is `#rrggbb`.
  - `maxWidth` is a fraction of the page width.
- **Layout:** `layoutName({ name, style, pageWidth, pageHeight, measure })` lives in the dependency-free `lib/certificates/layout.js`, which the browser preview also uses:
  - `width = font.widthOfTextAtSize(name, size)`
  - if `width > maxWidth·W`, then `size = size · maxWidth·W / width`
  - `drawX = x·W − width/2`
  - `drawY = H − y·H` (the baseline)
- **Browser preview:** uses a `<canvas>`, the uploaded font via the `FontFace` API, `textBaseline = 'alphabetic'` and the same maths, so the click-to-place preview matches the output closely. The sample PDF is the authoritative check.
- **Name normalisation:** trim and collapse internal whitespace. Casing is never changed automatically.
- **Missing glyphs:** if the font lacks a glyph for a character in the name, rendering throws `MissingGlyphError`. That job fails permanently, and the admin sees the reason.
- **PDF metadata:** the document title is `Certificate — <name> — <workshop>`.
- **Attachment filename:** `SkillSprint-Certificate-<Workshop>-<Name>.pdf`, with anything other than `[A-Za-z0-9-]` replaced by `-`.
- **Fonts:** accepts TTF/OTF up to 2 MB. The file signature is checked (collections and WOFF are rejected), the font is parsed with fontkit, and the family name is stored.

---

## 5. Attendee import

**`lib/certificates/sheets.js`:**
- `parseSheetUrl(url)` returns `{id, gid}`, and only accepts `docs.google.com/spreadsheets/d/<id>`.
- `fetchSheetCsv({id, gid})` fetches `https://docs.google.com/spreadsheets/d/<id>/export?format=csv&gid=<gid>`. An HTML response or a non-200 means the sheet isn't shared by link, and the error says how to fix it.
- `parseCsv(text)` follows RFC 4180: quoted fields, embedded newlines, `""` escapes and a BOM.

**`lib/certificates/recipients.js`:**
- **`pickColumns(headers)`:** chooses the name column (a header containing `full name`, else the first containing `name`) and the email column (the first header containing `mail`). If either is missing, it fails and lists the headers found.
- **`buildPreview(rows, existingEmails)`:** normalises each row and adds flags:
  - `duplicate`: the same email appears earlier in the file, so the row is excluded by default;
  - `existing`: the person is already imported, so the row is excluded;
  - `invalidEmail`: excluded;
  - `missingName`: excluded;
  - `oddCase`: the name is all upper or all lower case (warning only).

**Uploads:** a CSV is read as text and parsed on the server with the same parser. An `.xlsx` is parsed in the browser (a lazily loaded `read-excel-file`), and its rows are posted as JSON.

**Import:** `INSERT … ON CONFLICT (workshop_id, email) DO NOTHING`. Emails are lowercased.

After importing, the team can switch off link sharing on the sheets, because the data now lives in the database.

---

## 6. Data model

```sql
certificate_templates (
  workshop_id     UUID PRIMARY KEY REFERENCES workshops(id) ON DELETE CASCADE,
  canva_url       TEXT NOT NULL DEFAULT '',
  canva_design_id TEXT NOT NULL DEFAULT '',
  canva_title     TEXT NOT NULL DEFAULT '',
  pdf             BYTEA,
  preview_png     BYTEA,
  page_width      REAL,  page_height REAL,       -- PDF points
  page_count      INT,
  fetched_at      TIMESTAMPTZ,
  font            BYTEA,
  font_filename   TEXT NOT NULL DEFAULT '',
  font_family     TEXT NOT NULL DEFAULT '',
  name_x          REAL,  name_y REAL,            -- 0..1 from top-left, baseline centre
  name_size       REAL NOT NULL DEFAULT 36,
  name_color      TEXT NOT NULL DEFAULT '#111827',
  name_max_width  REAL NOT NULL DEFAULT 0.6,     -- fraction of page width
  created_at, updated_at
)

certificate_recipients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,                     -- lowercased
  source      TEXT NOT NULL DEFAULT '',
  created_at, updated_at,
  UNIQUE (workshop_id, email)
)

canva_connection (
  id            INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  access_token  TEXT NOT NULL,   -- encrypted
  refresh_token TEXT NOT NULL,   -- encrypted
  expires_at    TIMESTAMPTZ NOT NULL,
  scope         TEXT NOT NULL DEFAULT '',
  display_name  TEXT NOT NULL DEFAULT '',
  connected_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
)

canva_oauth_states (
  state         TEXT PRIMARY KEY,
  code_verifier TEXT NOT NULL,
  redirect_uri  TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

**Changes to `email_jobs`** (backward compatible, applied idempotently in `lib/schema.js`):

- `ALTER COLUMN registration_id DROP NOT NULL`
- `ADD COLUMN IF NOT EXISTS certificate_recipient_id UUID REFERENCES certificate_recipients(id) ON DELETE CASCADE`
- A CHECK constraint that exactly one of `registration_id` / `certificate_recipient_id` is set. It is added only if it doesn't already exist in `pg_constraint`. Every existing row has `registration_id`, so all of them pass.
- `CREATE UNIQUE INDEX IF NOT EXISTS email_jobs_unique_certificate ON email_jobs (certificate_recipient_id, template) WHERE certificate_recipient_id IS NOT NULL`

Certificate jobs use `template = 'certificate'`. That gives one certificate job per person per workshop.

---

## 7. Sending

**`lib/email/providers.js`:** both adapters accept an optional `attachments: [{filename, content(base64)}]`.
- Resend receives it as `attachments[{filename, content}]`.
- Brevo receives it as `attachment[{name, content}]`.

**`lib/email/certificateTemplate.js`:** `renderCertificateEmail({recipient, workshop, siteUrl})` returns `{subject, html, text}`, in the same visual style as `template.js`.
- Subject: `Your certificate — <workshop title>`.
- There is no unsubscribe footer and no `List-Unsubscribe` header.

**`lib/email/worker.js`:**
- `claimBatch` and `sendOneJob` also return `certificate_recipient_id`.
- **`processJob` branch for `template === 'certificate'`:**
  - loads the recipient, workshop and template (cached per workshop for the duration of a run);
  - renders the certificate and attaches it, then sends through the same provider/quota loop;
  - a missing template, font or placement fails the job with a clear `last_error`.
- The unsubscribe check applies only to registration jobs.
- **Run time:** certificates use the worker's existing time budget and concurrent send lanes (from `main`). The per-workshop template cache holds a promise, so parallel lanes share one load.

**Admin operations** (`lib/admin/certificates.js`, dispatched from `api/admin.js`, so there are no new serverless functions):

| Request | Behaviour |
|---|---|
| `GET` | Per-workshop summary: template/style/attendee readiness and job counts. |
| `GET ?workshopId=` | Template settings (no bytes), plus recipients with job status, provider, `last_error`, `sent_at`, `delivered_at`. |
| `GET ?workshopId=&asset=preview` | Preview PNG. |
| `GET ?workshopId=&asset=font` | Font bytes, for the browser `FontFace`. |
| `GET ?workshopId=&asset=sample&name=` | Rendered sample PDF. |
| `POST` op `fetch-template` | Export the design from Canva and store it. |
| `POST` op `save-style` | Save placement, size, colour and max width. |
| `POST` op `upload-font` | Validate and store the font. |
| `POST` op `preview-import` | Build the flagged preview from a Sheet link, CSV text or parsed rows. |
| `POST` op `import` | Save the confirmed rows. |
| `POST` op `update-recipient` / `delete-recipient` | Edit or remove one person. |
| `POST` op `send-test` | Render and send immediately to the given address. Counts against quota; no job row. |
| `POST` op `send-all` | Queue every recipient without a job, then run one worker batch. |
| `POST` op `process` | Run one worker batch. |
| `POST` op `resend` | Reset the job to `pending` (attempts 0), then `sendOneJob`. |

**Browser drain loop:** after Send all, the panel keeps calling `process` while jobs remain claimable and the result isn't `QUOTA_EXHAUSTED`. If the tab closes, the existing cron and the GitHub 6-hourly worker finish the job.

**Other touch points:**
- `lib/admin/stats.js` counts only `registration_id IS NOT NULL` jobs, so the Registrations tab cards keep their meaning. Quota usage stays global.
- `lib/webhooks/{resend,brevo}.js`: the email fallback match also joins `certificate_recipients`.
- `vercel.json` needs no change: the SPA rewrite already covers `/admin/canva/callback`, and its `noindex` header is extended to `/admin/(.*)`.

---

## 8. Frontend structure

`AdminView.vue` is already 950 lines, so the new tab lives in its own files:

- `src/components/admin/CertificatesTab.vue`: Canva status and the workshop list.
- `src/components/admin/CertificateWorkshop.vue`: one workshop's four steps.
- `src/components/admin/CertificateStylePreview.vue`: canvas, click-to-place and live text.
- `src/components/admin/CertificateImport.vue`: source input, flagged preview table and import.
- `src/components/admin/CertificateRecipients.vue`: the saved list, statuses, resend, edit and delete.
- `src/components/admin/CertificateSend.vue`: counts, test send, and the Send all drain loop.
- `src/utils/adminApi.js`: `fetch` wrappers returning parsed JSON, plus the shared class strings.

`AdminView.vue` changes:
- add the tab;
- handle the `/admin/canva/callback` route (`router`: an alias of `/admin`, so the same view instance handles it);
- pass `toast` down.

---

## 9. Security

- Every operation is behind `requireAdmin`. Asset responses send `Cache-Control: no-store`.
- Canva tokens are encrypted at rest. OAuth `state` is single-use with a 15-minute expiry. PKCE is S256.
- Outbound fetches are limited to fixed hosts built from validated IDs: `canva.link`, `api.canva.com`, `docs.google.com`, plus the export download URL returned by Canva's API, which must be `https:`.
- Upload limits: font ≤ 2 MB, CSV ≤ 1 MB, import ≤ 2,000 rows.

---

## 10. Testing

**Unit tests** (`node --test`, no new dependencies), run with `npm test`:
- CSV parser (quotes, embedded newlines, BOM)
- Sheet and Canva URL parsing (accept and reject cases)
- `pickColumns` and `buildPreview` flags
- name normalisation
- `layoutName` geometry, including shrink-to-fit
- token encryption round trip
- a full `renderCertificate` using a system TTF when one is available (skipped otherwise)

**Integration:** handlers exercised locally against the database, using a throwaway test workshop that is deleted afterwards. The real attendee lists are imported only when the team is ready to send.

**Browser:** the Certificates tab driven in the preview pane. The admin signs in themselves.

**Never** send to real attendees during testing. Test sends go only to an address the team provides.

---

## 11. Out of scope

- Certificate IDs and a public verification page.
- Server-side editing of Canva designs.
- Per-person fields other than the name.
- Bundling multiple workshops' certificates into one email. Each workshop sends its own email.
