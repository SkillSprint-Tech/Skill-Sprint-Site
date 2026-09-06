import { SITE_TIME_ZONE, SITE_TIME_ZONE_LABEL } from '../../lib/timezone.js'

export { SITE_TIME_ZONE, SITE_TIME_ZONE_LABEL }

/**
 * Workshop dates rendered in the site's timezone rather than the viewer's.
 *
 * Passing no `timeZone` to toLocaleString silently uses the device's zone. That is the
 * default almost every one of these helpers used to take, and it is wrong here: the
 * emails commit to Pakistan time, so a browser in any other zone showed a different day
 * for the same session. A workshop at 8 Sept 00:30 PKT is stored as 7 Sept 19:30 UTC, and
 * rendered on a UTC machine as "7 Sept" — contradicting the email in the reader's inbox.
 */
const withZone = (options) => ({ timeZone: SITE_TIME_ZONE, ...options })

const fmt = (value, options) =>
  new Date(value).toLocaleString('en-GB', withZone(options))

export const monthOf = (v) => fmt(v, { month: 'short' })
export const dayOf = (v) => fmt(v, { day: 'numeric' })
export const timeOf = (v) => fmt(v, { hour: '2-digit', minute: '2-digit', hour12: false })
export const shortDate = (v) => fmt(v, { day: '2-digit', month: 'short', year: '2-digit' })

export const dateTime = (v) =>
  fmt(v, {
    day: '2-digit', month: 'short', year: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })

/**
 * Offset of SITE_TIME_ZONE at a given instant, in minutes.
 *
 * Derived from Intl rather than hardcoded as +5. Pakistan has had no DST since 2009, so
 * this is +300 today — but a hardcoded constant would silently shift every workshop by an
 * hour if that ever changed, or if SITE_TIME_ZONE were pointed somewhere else.
 */
function zoneOffsetMinutes(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE_TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date)

  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]))
  const asIfUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second)
  return (asIfUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000
}

/** An instant → the `YYYY-MM-DDTHH:mm` a datetime-local input needs, in site time. */
export function toZonedInput(iso) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE_TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(iso))

  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]))
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`
}

/**
 * A datetime-local value → an ISO instant, reading the wall clock as site time.
 *
 * `new Date('2026-09-08T00:30')` parses in the *browser's* zone, so an admin outside
 * Pakistan would schedule a session hours away from the time registrants are emailed.
 */
export function fromZonedInput(value) {
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!match) return null

  const [, y, mo, d, h, mi] = match.map(Number)
  const asIfUtc = Date.UTC(y, mo - 1, d, h, mi)

  // Two passes so a zone with DST settles on the offset in force at the resulting
  // instant, not the one at the naive guess. A fixed-offset zone converges on the first.
  let ts = asIfUtc - zoneOffsetMinutes(new Date(asIfUtc)) * 60000
  ts = asIfUtc - zoneOffsetMinutes(new Date(ts)) * 60000

  return Number.isNaN(ts) ? null : new Date(ts).toISOString()
}
