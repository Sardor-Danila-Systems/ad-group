/** Checks the instalment maths. Run: npm run test:installment */
import { strict as assert } from "node:assert";
import { installment } from "../src/lib/installment";

const r = installment({ price: 60_000, downPct: 30, term: 24, currency: "USD" });
assert.deepEqual(r, { error: null, price: 60_000, down: 18_000, rest: 42_000, term: 24, monthly: 1_750, last: 1_750 });

// Remainder goes to the last payment and the sum always matches the price.
for (const [price, pct, term] of [[100_001, 15, 7], [55_555, 0, 60], [5_000, 90, 1], [999_999, 35, 59], [760_000_000, 20, 36]] as const) {
  const x = installment({ price, downPct: pct, term, currency: price > 5_000_000 ? "UZS" : "USD" });
  assert.equal(x.error, null, `${price}`);
  assert.equal(x.down + x.monthly * (x.term - 1) + x.last, x.price, `sum ${price}/${pct}/${term}`);
  assert.ok(x.last >= x.monthly && x.last - x.monthly < x.term, `last payment close to the others ${price}`);
}

// Validation
assert.equal(installment({ price: 0, downPct: 30, term: 12, currency: "USD" }).error, "price");
assert.equal(installment({ price: Number.NaN, downPct: 30, term: 12, currency: "USD" }).error, "price");
assert.equal(installment({ price: 10_000_000, downPct: 30, term: 12, currency: "USD" }).error, "price");
assert.equal(installment({ price: 60_000, downPct: 30, term: 0, currency: "USD" }).error, "term");
assert.equal(installment({ price: 60_000, downPct: 30, term: 61, currency: "USD" }).error, "term");
assert.equal(installment({ price: 60_000, downPct: 30, term: 2.5, currency: "USD" }).error, "term");
assert.equal(installment({ price: 60_000, downPct: 150, term: 12, currency: "USD" }).down, 54_000, "down payment capped at 90%");
assert.equal(installment({ price: 60_000, downPct: -10, term: 12, currency: "USD" }).down, 0);
assert.equal(installment({ price: 60_000, downPct: 0, term: 1, currency: "USD" }).monthly, 60_000);
console.log("installment: all passed");
