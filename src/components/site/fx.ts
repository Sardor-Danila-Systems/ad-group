/**
 * Hover fills for buttons (styles: .fx-fill in globals.css). The second colour rises from the bottom.
 * - gold: a gold button filling with ink;
 * - goldOnDark: a gold button on a dark block, filling with paper;
 * - ink: a dark button filling with gold;
 * - outline: a gold outline button filling with gold.
 */
export const fx = {
  gold: "fx-fill [--fx:var(--ink)] hover:text-paper",
  goldOnDark: "fx-fill [--fx:var(--paper)] hover:text-ink",
  ink: "fx-fill [--fx:var(--gold)] hover:text-ink",
  outline: "fx-fill [--fx:var(--gold)] hover:text-ink",
} as const;
