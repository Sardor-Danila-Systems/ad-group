import "server-only";
import { Pool } from "pg";

/** Minimal database surface used by the Postgres store. Tests inject another implementation (PGlite). */
export interface Db {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>;
  exec(text: string): Promise<void>;
  tx<R>(fn: (q: Db["query"]) => Promise<R>): Promise<R>;
}

let injected: Db | undefined;
let pool: Pool | undefined;

export const hasDatabase = () => Boolean(injected || process.env.DATABASE_URL);

/** For tests only. */
export function __useDb(db: Db | undefined) {
  injected = db;
}

function getPool() {
  // One pool per server instance. Neon's pooled connection string (pgbouncer) keeps serverless fan-out cheap.
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 15_000 });
  return pool;
}

export const db: Db = {
  async query(text, params) {
    if (injected) return injected.query(text, params);
    const r = await getPool().query(text, params as unknown[]);
    return { rows: r.rows, rowCount: r.rowCount ?? 0 } as never;
  },
  async exec(text) {
    if (injected) return injected.exec(text);
    await getPool().query(text);
  },
  async tx(fn) {
    if (injected) return injected.tx(fn);
    const client = await getPool().connect();
    try {
      await client.query("begin");
      const out = await fn(async (text, params) => {
        const r = await client.query(text, params as unknown[]);
        return { rows: r.rows, rowCount: r.rowCount ?? 0 } as never;
      });
      await client.query("commit");
      return out;
    } catch (e) {
      await client.query("rollback").catch(() => undefined);
      throw e;
    } finally {
      client.release();
    }
  },
};
