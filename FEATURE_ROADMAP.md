# SkillSprint Feature Roadmap & Technical Specifications

> **Status:** Approved for future implementation  
> **Rule:** No code changes are to be executed without explicit user permission.  
> **Document Purpose:** Complete architectural, database, API, and UI/UX specifications for the 7 approved platform enhancements.

---

## Table of Contents
1. [Feature 1: Team Member Edit & Re-ordering](#feature-1-team-member-edit--re-ordering)
2. [Feature 2: Public Certificate Verification Portal (`/verify/:id`)](#feature-2-public-certificate-verification-portal-verifyid)
3. [Feature 3: 1-Click Live Workshop Check-in & Mobile QR Scanner](#feature-3-1-click-live-workshop-check-in--mobile-qr-scanner)
4. [Feature 4: Automated 1-Hour & 24-Hour Workshop Reminders](#feature-4-automated-1-hour--24-hour-workshop-reminders)
5. [Feature 6: "My Certificates & Events" Attendee Self-Service Portal](#feature-6-my-certificates--events-attendee-self-service-portal)
6. [Feature 7: Post-Workshop Resource Hub (Recordings, Slides, Repos)](#feature-7-post-workshop-resource-hub-recordings-slides-repos)
7. [Feature 8: Interactive Track Matchmaker Quiz ("Find Your Sprint")](#feature-8-interactive-track-matchmaker-quiz-find-your-sprint)
8. [Implementation Phasing & Priority Matrix](#implementation-phasing--priority-matrix)

---

## Feature 1: Team Member Edit & Re-ordering

### 1.1 Overview & Problem Statement
Currently in the admin panel ([AdminView.vue](file:///c:/skill-sprint-site/src/views/AdminView.vue)), team members can only be **Added** or **Deleted**. If an organizer makes a typo, an attendee gets promoted, or someone updates their avatar, the record must be deleted and re-created from scratch. Additionally, members display in chronological creation order (`created_at ASC`), preventing organizers from curating who appears first on the public [`/team`](file:///c:/skill-sprint-site/src/views/TeamView.vue) page.

### 1.2 Database Changes (`lib/schema.js`)
Add an integer column for manual sorting:
```sql
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
```

### 1.3 Backend API (`api/team-members.js`)
1. **Update `ALLOWED` Methods:** Add `'PATCH'` and `'PUT'` to `['GET', 'POST', 'DELETE', 'PATCH', 'PUT']`.
2. **Implement `PATCH /api/team-members?id=<UUID>`:**
   - **Authentication:** `requireAdmin(req, res)`
   - **Payload:**
     ```json
     {
       "name": "Abdullah Nadeem",
       "role": "Lead Architect",
       "bio": "Building distributed systems and developer tooling.",
       "image": "data:image/jpeg;base64,...",
       "focus": ["Core Builder", "Systems"],
       "sort_order": 1
     }
     ```
   - **Query:** Update matching row and return updated record. If `image` is not provided in payload, preserve existing `image`.
3. **Implement Reorder Endpoint `PATCH /api/team-members/reorder`:**
   - Accepts array of `{ id: UUID, sort_order: number }` to update multiple orders in a single SQL transaction.

### 1.4 Frontend Implementation ([AdminView.vue](file:///c:/skill-sprint-site/src/views/AdminView.vue))
- **Team Table UI:**
  - Add an **"Edit"** button styled in blue next to the red "Delete" button.
  - Add Up/Down reordering buttons or drag handles to change `sort_order`.
- **Form State:**
  - Introduce `editingMemberId = ref(null)`.
  - When "Edit" is clicked:
    - Pre-fill `tForm` with member's `name`, `role`, `bio`, and `image`.
    - Change form title to "Edit Team Member" and button label to "Save Changes".
    - Display a "Cancel Edit" button that resets `tForm` and `editingMemberId`.
  - On submit:
    - If `editingMemberId` is active, send `PATCH /api/team-members?id=...`.
    - If null, send `POST /api/team-members`.

---

## Feature 2: Public Certificate Verification Portal (`/verify/:id`)

### 2.1 Overview & Value Proposition
Students share certificates on LinkedIn, resumes, and portfolio sites. Providing a tamper-proof verification URL with an official SkillSprint digital seal and verification status elevates institutional credibility for universities and recruiters.

### 2.2 Database Changes (`lib/schema.js`)
```sql
ALTER TABLE certificate_recipients ADD COLUMN IF NOT EXISTS verification_code VARCHAR(32) UNIQUE;
ALTER TABLE certificate_recipients ADD COLUMN IF NOT EXISTS issued_at TIMESTAMPTZ DEFAULT now();

-- Backfill existing recipients with unique secure verification codes
UPDATE certificate_recipients 
SET verification_code = LOWER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 16))
WHERE verification_code IS NULL;
```

### 2.3 Backend API
Create new endpoint: `api/verify-certificate.js`
- **Route:** `GET /api/verify-certificate?code=<CODE_OR_ID>` (Public, rate-limited by IP)
- **Response:**
  ```json
  {
    "ok": true,
    "valid": true,
    "certificate": {
      "recipient_name": "Jane Doe",
      "workshop_title": "Modern Frontend Architecture & Microfrontends",
      "speaker": "Abdullah Nadeem",
      "issue_date": "2026-09-20T10:00:00Z",
      "duration_hours": 2.5,
      "verification_code": "a1b2c3d4e5f67890",
      "organization": "SkillSprint Technical Community"
    }
  }
  ```

### 2.4 Certificate PDF Generation (`lib/certificates/renderPdf.js`)
- Dynamically generate a QR code pointing to `https://skillsprint.tech/verify/<verification_code>`.
- Stamp the QR code and verification string (e.g. `ID: SS-A1B2-C3D4`) at the bottom corner of the generated PDF certificate.

### 2.5 Frontend Implementation
- **New View:** `src/views/VerifyCertificateView.vue`
- **Route:** `/verify/:code` in `src/router/index.js`
- **Visual Design:**
  - High-trust, card layout with subtle security guilloche background pattern or gradient glow.
  - Large animated green check badge: *"Officially Issued by SkillSprint"*.
  - Attendee name, workshop title, date, credential ID.
  - One-click **"Add to LinkedIn Profile"** button (pre-populating LinkedIn Certification URL schema).
  - One-click **"Download Original PDF"** button.

---

## Feature 3: 1-Click Live Workshop Check-in & Mobile QR Scanner

### 3.1 Overview & Value Proposition
During live workshops (in-person or hybrid), tracking physical attendance is currently friction-heavy. Organizers need a camera-based QR scanner or instant search toggle on mobile/laptop to check attendees in within 1 second.

### 3.2 Database Changes (`lib/schema.js`)
```sql
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS attended BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS registrations_attended_idx ON registrations (attended);
```

### 3.3 Backend API
Create or extend endpoint `api/admin/check-in.js`:
- **Route:** `POST /api/admin/check-in`
- **Authentication:** `requireAdmin(req, res)`
- **Payload:** `{ "registrationId": "<UUID>", "attended": true }` or `{ "qrPayload": "<TOKEN>" }`
- **Action:** Sets `attended = true` and `checked_in_at = now()`. Returns updated registration row and real-time workshop attendance counts.

### 3.4 Frontend Implementation ([AdminAttendeeDrawer.vue](file:///c:/skill-sprint-site/src/components/admin/AdminAttendeeDrawer.vue) & New Scanner Component)
- **Component:** `src/components/admin/AdminQrScannerModal.vue`
  - Utilizes `html5-qrcode` or the native browser `BarcodeDetector` API.
  - Organizer points phone or webcam at the attendee's ticket QR code (sent in their registration confirmation email).
  - On detection: Instant sound chime, green screen flash, attendee details appear with **"Checked In"** badge.
- **Registrations Table Integration:**
  - Add an **"Attended"** toggle column directly in the table for fast keyboard/mouse check-in without opening the drawer.

---

## Feature 4: Automated 1-Hour & 24-Hour Workshop Reminders

### 4.1 Overview & Value Proposition
Workshop registrants frequently forget upcoming sessions. Automated transactional reminder emails sent 24 hours and 1 hour before start time cut no-show rates by up to 40%.

### 4.2 Database Changes (`lib/schema.js`)
```sql
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS reminder_24h_sent_at TIMESTAMPTZ;
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS reminder_1h_sent_at TIMESTAMPTZ;
```

### 4.3 Email Queue & Worker Architecture (`api/cron.js` & `lib/email/worker.js`)
1. **Cron Job Schedule (Vercel Cron / external trigger every 15 minutes):**
   - Query published workshops where `status = 'published'` or `status = 'live'`:
     - **24-Hour Condition:** `starts_at BETWEEN now() + interval '23 hours' AND now() + interval '25 hours'` AND `reminder_24h_sent_at IS NULL`.
     - **1-Hour Condition:** `starts_at BETWEEN now() + interval '45 minutes' AND now() + interval '75 minutes'` AND `reminder_1h_sent_at IS NULL`.
2. **Batch Queue Injection:**
   - Enqueue jobs into `email_jobs` with template `workshop_reminder_24h` and `workshop_reminder_1h`.
   - The existing idempotent constraint `UNIQUE (registration_id, template)` prevents duplicate sends.
3. **Email Content:**
   - Personalized attendee greeting.
   - Clean calendar invite (`.ics`) attachment or Google Calendar direct link.
   - Prominent, high-contrast **"Join Workshop"** button with meeting link.
   - Agenda recap and speaker details.

---

## Feature 6: "My Certificates & Events" Attendee Self-Service Portal

### 6.1 Overview & Value Proposition
Attendees regularly misplace emails or need to re-download certificates when applying for jobs. A lightweight, passwordless attendee portal eliminates manual support requests.

### 6.2 Authentication Model (Zero-Password Magic Link / Code)
To prevent friction, students do not need passwords:
1. Student enters their registered email address at `/portal`.
2. System sends a 6-digit one-time code (valid for 15 minutes) or a secure magic link:
   ```sql
   CREATE TABLE IF NOT EXISTS attendee_auth_tokens (
     id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email      TEXT NOT NULL,
     token_hash TEXT NOT NULL,
     expires_at TIMESTAMPTZ NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ```
3. Once verified, a short-lived signed JWT session cookie (`ss_attendee_session`) is returned.

### 6.3 Portal Backend API (`api/portal/`)
- `POST /api/portal/send-code`: Sends login code.
- `POST /api/portal/verify-code`: Verifies code, returns attendee session.
- `GET /api/portal/me`: Fetches all registrations, attended workshops, and issued certificates belonging to that email.

### 6.4 Frontend Implementation
- **New View:** `src/views/AttendeePortalView.vue` (`/portal` or `/my-events`)
- **Dashboard Sections:**
  - **Active Registrations:** Upcoming workshops with meeting links, calendar links, and live countdown timer.
  - **Certificate Vault:** Grid of all earned certificates with preview images, direct PDF download, verification link, and LinkedIn badge integration.
  - **Attendance History:** Record of completed sprint tracks and workshops.

---

## Feature 7: Post-Workshop Resource Hub (Recordings, Slides, Repos)

### 7.1 Overview & Value Proposition
After a workshop concludes, presentation slides, GitHub demo repositories, and video recordings are frequently lost across chat channels. Centralizing resources on the public site provides long-term community educational value.

### 7.2 Database Changes (`lib/schema.js`)
```sql
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS recording_url TEXT NOT NULL DEFAULT '';
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS slides_url TEXT NOT NULL DEFAULT '';
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS repo_url TEXT NOT NULL DEFAULT '';
ALTER TABLE workshops ADD COLUMN IF NOT EXISTS resources_notes TEXT NOT NULL DEFAULT '';
```

### 7.3 Backend API (`api/workshops.js`)
- Update `PATCH /api/workshops` to allow admins to save resource URLs and notes.
- Public `GET /api/workshops` returns these resource links for any workshop where `status = 'completed'` (or drafts/upcoming when requested by admin).

### 7.4 Frontend Implementation
- **Admin Workshop Form:**
  - Add a dedicated **"Post-Event Resources"** collapsible section in the workshop editor:
    - YouTube/Loom Recording Link input
    - Presentation Slides (Google Slides / Canva / PDF URL)
    - GitHub Code Repository URL
    - Markdown Key Takeaways & Cheat Sheet
- **Public Workshops View ([WorkshopsView.vue](file:///c:/skill-sprint-site/src/views/WorkshopsView.vue)):**
  - In the "Completed Sessions" section, add dynamic resource action buttons to workshop cards:
    - 🎥 **"Watch Recording"** (opens responsive video modal or new tab)
    - 📑 **"View Slides"**
    - 💻 **"Starter Code"**
    - 🏷️ **"View Certificate Criteria"**

---

## Feature 8: Interactive Track Matchmaker Quiz ("Find Your Sprint")

### 8.1 Overview & Value Proposition
New students landing on SkillSprint often hesitate because they don't know which track fits their skill level (e.g. Frontend Architecture vs. Systems/API vs. Open Source Tooling). A 60-second interactive questionnaire provides personalized track recommendations and increases sprint registrations.

### 8.2 Client-Side Decision Tree Logic
No backend database required initially; operates purely as an interactive Vue component:
```javascript
// Sample scoring engine
const tracks = {
  frontend: { title: "Open-Source Frontend Architecture", score: 0 },
  backend:  { title: "API Design & Systems Architecture", score: 0 },
  devops:   { title: "Cloud Systems & DevOps Pipeline", score: 0 }
};
```

### 8.3 Quiz Architecture & User Flow
1. **Trigger:** Prominent CTA button on Home and Sprints pages: *"Not sure where to start? Take the 60s Track Quiz"*.
2. **Questions (4 Interactive Card Slides with fluid animations):**
   - **Q1 (Passion):** *"What do you enjoy building most?"*
     - [A] Slick UI animations, design systems, and web applications
     - [B] Fast APIs, databases, authentication, and background queues
     - [C] Deployment pipelines, server infrastructure, and CLI tools
   - **Q2 (Experience):** *"Where are you in your coding journey?"*
     - [A] Know HTML/CSS/JS fundamentals, looking for real team experience
     - [B] Have built full-stack hobby projects, want production rigor
     - [C] Experienced, want to lead architectural decisions
   - **Q3 (Goal):** *"What is your primary objective for this semester?"*
     - [A] Land a high-paying frontend/product engineering role
     - [B] Master backend reliability and distributed systems
     - [C] Build a standout GitHub portfolio with merged open-source PRs
3. **Result Screen:**
   - Displays match percentage (e.g. *"96% Match: Frontend Architecture Sprint"*).
   - Summary of technologies used (Vue, Vite, Tailwind, GSAP).
   - Next upcoming workshop relevant to this track.
   - Action Button: *"Apply for this Track"* (pre-selects interest in registration form).

---

## Implementation Phasing & Priority Matrix

| Phase | Feature | Complexity | Dependencies | User Impact |
|---|---|---|---|---|
| **Phase 1** | **Feature 1: Team Member Edit & Re-ordering** | Low | None | High (Immediate Admin Usability) |
| **Phase 2** | **Feature 7: Post-Workshop Resource Hub** | Low–Medium | Database columns | High (Immediate Student Value) |
| **Phase 3** | **Feature 2: Public Certificate Verification (`/verify/:id`)** | Medium | Certificate engine | Very High (Institution Credibility) |
| **Phase 4** | **Feature 4: Automated 1-Hour Workshop Reminders** | Medium | Cron / Email Queue | High (Reduces No-Show Rates) |
| **Phase 5** | **Feature 3: 1-Click Check-in & QR Scanner** | Medium | Camera API / Admin UI | High (Smooth Live Operations) |
| **Phase 6** | **Feature 8: Interactive Track Matchmaker Quiz** | Low–Medium | Frontend only | High (New Student Conversion) |
| **Phase 7** | **Feature 6: Attendee Self-Service Portal** | Medium–High | Magic link auth | High (Support Load Reduction) |

---

> **Ready for Execution:**  
> When you are ready to begin implementing any of these features, let me know which one you would like to start with. An implementation plan will be created and reviewed before any code changes are made.
