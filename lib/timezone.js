/**
 * The one timezone this product speaks in.
 *
 * Every workshop time is a Pakistani wall-clock time: that is what an admin types, what
 * the site shows, and what the emails say. Storage stays UTC (TIMESTAMPTZ), but nothing
 * user-facing may render in the viewer's local zone — a student abroad, or anyone whose
 * laptop clock is not set to PKT, would otherwise be shown a different day from the one
 * the email promised them.
 *
 * Imported by both the server-side email templates and the client, so the two cannot
 * drift apart.
 */
export const SITE_TIME_ZONE = 'Asia/Karachi'

/** Shown next to times so the zone is never left to be inferred. */
export const SITE_TIME_ZONE_LABEL = 'PKT'
