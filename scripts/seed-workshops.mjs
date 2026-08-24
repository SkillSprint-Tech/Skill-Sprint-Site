#!/usr/bin/env node
/**
 * Seed the September 2026 career-readiness workshop series.
 *
 *   node scripts/seed-workshops.mjs --dry-run
 *   node scripts/seed-workshops.mjs
 *
 * Idempotent: matches on title, so re-running updates the existing rows rather than
 * creating duplicates. Safe to run after editing the entries below.
 *
 * Times are placeholders at 19:00 PKT (Pakistan is UTC+5 year-round, no DST) — adjust
 * each session in /admin rather than editing and re-running this.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const { Pool } = pg
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DRY_RUN = process.argv.includes('--dry-run')

function loadEnv() {
  const file = path.join(ROOT, '.env')
  if (!fs.existsSync(file)) return
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

/** 19:00 Pakistan Standard Time (UTC+5) on the given September 2026 date. */
const at7pmPkt = (day) => new Date(Date.UTC(2026, 8, day, 14, 0, 0)).toISOString()

const WORKSHOPS = [
  {
    title: 'Your Story on Paper',
    description:
      'Turn a blank page into a CV that actually gets read. We cover structure, wording that survives applicant tracking systems, and how to describe projects when you have no formal work experience yet. Bring a draft if you have one.',
    speaker: '',
    speaker_role: 'CV Writing & Optimisation',
    starts_at: at7pmPkt(7),
    duration_mins: 90,
    location: 'Online — link shared before the session',
    seats: null,
    status: 'upcoming',
    sort_order: 1,
    is_published: true,
  },
  {
    title: 'Your Digital Presence',
    description:
      'Two halves. First, LinkedIn: headline, About section, and how recruiters actually search. Then Stand Out Online — building a personal brand and a portfolio that shows your work rather than just claiming it.',
    speaker: '',
    speaker_role: 'LinkedIn Optimisation & Personal Branding',
    starts_at: at7pmPkt(9),
    duration_mins: 90,
    location: 'Online — link shared before the session',
    seats: null,
    status: 'upcoming',
    sort_order: 2,
    is_published: true,
  },
  {
    title: 'Find the Right Opportunities',
    description:
      'Job hunting as a system, not a scroll. Where the real openings are posted, how to filter out time-wasters, tailoring an application without rewriting everything, and how to follow up without being ignored.',
    speaker: '',
    speaker_role: 'Job Search Strategy & Applications',
    starts_at: at7pmPkt(11),
    duration_mins: 90,
    location: 'Online — link shared before the session',
    seats: null,
    status: 'upcoming',
    sort_order: 3,
    is_published: true,
  },
  {
    title: 'Tech for Your Career',
    description:
      'The tools that genuinely save you hours, and the ones that just look impressive. Practical AI workflows, productivity systems that survive a busy semester, and what employers now expect you to already know.',
    speaker: '',
    speaker_role: 'AI Tools, Productivity & the Modern Workplace',
    starts_at: at7pmPkt(13),
    duration_mins: 90,
    location: 'Online — link shared before the session',
    seats: null,
    status: 'upcoming',
    sort_order: 4,
    is_published: true,
  },
]

const COLUMNS = [
  'title', 'description', 'speaker', 'speaker_role', 'starts_at',
  'duration_mins', 'location', 'seats', 'status', 'sort_order', 'is_published',
]

async function main() {
  loadEnv()
  if (!process.env.DB_URI) {
    console.error('\n  ✗ DB_URI is not set. Add it to .env and try again.\n')
    process.exit(1)
  }

  console.log('\n  SkillSprint · September 2026 workshop series')
  console.log('  ' + '─'.repeat(52))
  console.log(DRY_RUN ? '  MODE: dry run — nothing will be written\n' : '  MODE: live\n')

  const pool = new Pool({
    connectionString: process.env.DB_URI,
    ssl: { rejectUnauthorized: false },
    max: 2,
  })

  try {
    let inserted = 0
    let updated = 0

    for (const w of WORKSHOPS) {
      const when = new Date(w.starts_at).toLocaleString('en-GB', {
        timeZone: 'Asia/Karachi',
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      })

      if (DRY_RUN) {
        console.log(`  would seed: ${w.title}`)
        console.log(`              ${when} PKT · ${w.duration_mins} min`)
        continue
      }

      const existing = await pool.query('SELECT id FROM workshops WHERE title = $1', [w.title])
      const values = COLUMNS.map((c) => w[c])

      if (existing.rows.length) {
        const assignments = COLUMNS.map((c, i) => `${c} = $${i + 2}`).join(', ')
        await pool.query(
          `UPDATE workshops SET ${assignments}, updated_at = now() WHERE id = $1`,
          [existing.rows[0].id, ...values]
        )
        updated++
        console.log(`  ↻ updated  ${w.title}  —  ${when} PKT`)
      } else {
        const placeholders = COLUMNS.map((_, i) => `$${i + 1}`).join(', ')
        await pool.query(
          `INSERT INTO workshops (${COLUMNS.join(', ')}) VALUES (${placeholders})`,
          values
        )
        inserted++
        console.log(`  + added    ${w.title}  —  ${when} PKT`)
      }
    }

    if (DRY_RUN) {
      console.log('\n  Dry run complete. Re-run without --dry-run to write.\n')
      return
    }

    const total = await pool.query('SELECT count(*)::int AS c FROM workshops')
    console.log('\n  ' + '─'.repeat(52))
    console.log(`  Inserted: ${inserted}   Updated: ${updated}   Total in DB: ${total.rows[0].c}`)
    console.log('\n  ✓ Live on /workshops. Adjust times and speakers in /admin.\n')
  } finally {
    await pool.end().catch(() => {})
  }
}

main().catch((error) => {
  console.error('\n  ✗ Seed failed:', error.message, '\n')
  process.exit(1)
})
