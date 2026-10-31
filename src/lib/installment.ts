export type Currency = "USD" | "UZS";

/** Input bounds. Without terms from the developer: interest-free, down payment 0–90%, up to 60 months. */
export const LIMITS = {
  USD: { minPrice: 5_000, maxPrice: 5_000_000, defaultPrice: 60_000 },
  UZS: { minPrice: 50_000_000, maxPrice: 60_000_000_000, defaultPrice: 760_000_000 },
  minDownPct: 0,
  maxDownPct: 90,
  minTerm: 1,
  maxTerm: 60,
} as const;

export interface InstallmentInput {
  price: number;
  downPct: number;
  term: number;
  currency: Currency;
}

export interface InstallmentResult {
  error: "price" | "term" | null;
  price: number;
  down: number;
  rest: number;
  term: number;
  monthly: number;
}

/**
 * Interest-free instalment: the balance after the down payment is split into equal monthly parts.
 * Amounts are whole units of the currency; the last payment absorbs the remainder (it is never smaller
 * than the others), so down + monthly × (term − 1) + last always equals the price.
 */
export function installment({ price, downPct, term, currency }: InstallmentInput): InstallmentResult & { last: number } {
  const lim = LIMITS[currency];
  const pct = Math.min(Math.max(Number.isFinite(downPct) ? downPct : 0, LIMITS.minDownPct), LIMITS.maxDownPct);
  const empty = { price: 0, down: 0, rest: 0, term: 0, monthly: 0, last: 0 };
  if (!Number.isFinite(price) || price < lim.minPrice || price > lim.maxPrice) return { error: "price", ...empty };
  if (!Number.isInteger(term) || term < LIMITS.minTerm || term > LIMITS.maxTerm) return { error: "term", ...empty, price };
  const total = Math.round(price);
  const down = Math.round((total * pct) / 100);
  const rest = total - down;
  const monthly = Math.floor(rest / term);
  const last = rest - monthly * (term - 1);
  return { error: null, price: total, down, rest, term, monthly, last };
}
