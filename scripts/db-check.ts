/** Connects with DATABASE_URL, creates the schema and seed if needed, and prints row counts. Run: npm run db:check */
import { db } from "../src/lib/server/db";
import { pgStore } from "../src/lib/server/pg-store";

async function main() {
  const c = await pgStore.loadContent();
  const counts = await db.query<{ t: string; n: string }>(
    "select 'projects' t, count(*) n from projects union all select 'news', count(*) from news union all select 'vacancies', count(*) from vacancies union all select 'leads', count(*) from leads union all select 'uploads', count(*) from uploads",
  );
  console.log("connected; projects:", c.projects.map((p) => p.id).join(", "));
  console.table(Object.fromEntries(counts.rows.map((r) => [r.t, Number(r.n)])));
  process.exit(0);
}
main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
