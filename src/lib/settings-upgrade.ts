import { SEED_CEO, SEED_FOUNDER } from "@/lib/seed";
import type { Settings } from "@/lib/types";

const PLACEHOLDER_NAMES = new Set(["Имя Фамилия"]);

/**
 * Brings settings saved by an older version up to date without touching real edits:
 * a missing CEO block is added, and the founder placeholder name is replaced with the real one.
 */
export function upgradeSettings(stored: Partial<Settings>): { settings: Settings; changed: boolean } {
  let changed = false;
  const settings = structuredClone(stored) as Settings;
  if (!settings.ceo) {
    settings.ceo = structuredClone(SEED_CEO);
    changed = true;
  }
  if (settings.founder && PLACEHOLDER_NAMES.has(settings.founder.name?.ru)) {
    settings.founder.name = structuredClone(SEED_FOUNDER.name);
    changed = true;
  }
  return { settings, changed };
}
