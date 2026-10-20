export type Lang = "ru" | "uz" | "en";
export type L10n = Record<Lang, string>;
export type ProjectKind = "vatan" | "tower" | "slab" | "stepped" | "blocks";
export type Status = "build" | "done" | "plan";

export interface GalleryPhoto {
  src: string;
  w: number;
  h: number;
  alt?: L10n;
}

export interface Fact {
  label: L10n;
  value: string;
}

export interface Project {
  id: string; // URL slug
  cat: "residential" | "commercial";
  status: Status;
  year?: number;
  /** Placeholder art style used when there is no cover photo. */
  kind: ProjectKind;
  cover?: string;
  gallery: GalleryPhoto[];
  name: L10n;
  desc: L10n;
  long?: L10n;
  /** Price per m² in USD, shown as "from $X". */
  price?: number;
  facts: Fact[];
  features: L10n[];
  /** Highlighted on the home page and sorted first. */
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: L10n;
  text: L10n;
  image?: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  interest: string;
  message: string;
  source: string;
}
