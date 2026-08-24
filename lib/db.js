import pg from 'pg'

const { Pool } = pg

/**
 * Shared Postgres pool for every API route.
 *
 * Cached on globalThis because the Vite dev API plugin re-imports handler files on each
 * request, and serverless warm starts re-run module init — without the cache we'd leak a
 * new pool per request until the connection limit is hit.
 *
 * Targets Neon. Use the *pooled* connection string (the host containing `-pooler`), which
 * routes through PgBouncer — serverless functions open and drop connections constantly and
 * would exhaust a direct endpoint.
 */
function buildPool() {
  const connectionString = process.env.DB_URI

  if (!connectionString) {
    throw new Error('DB_URI environment variable is not set')
  }

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    // Keep this low: many concurrent serverless instances each hold their own pool.
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  })
}

export function getPool() {
  if (!globalThis.__ssPool) {
    globalThis.__ssPool = buildPool()
  }
  return globalThis.__ssPool
}

/** Run a single query. */
export function query(text, params) {
  return getPool().query(text, params)
}

/**
 * Run `fn` inside a transaction, committing on success and rolling back on any throw.
 * The callback receives a dedicated client — use it for every statement in the unit of work.
 */
export async function withTransaction(fn) {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {
      // A rollback failure means the connection is already broken; the original error is
      // the one worth surfacing, so swallow this and let it propagate.
    }
    throw error
  } finally {
    client.release()
  }
}
