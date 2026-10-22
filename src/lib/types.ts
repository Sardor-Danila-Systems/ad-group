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

/** An arrow in a showroom scene that leads to another scene. Angles are in radians. */
export interface ShowroomLink {
  to: string;
  yaw: number;
  pitch: number;
}

/** One viewpoint of the 3D showroom: an equirectangular (2:1) panorama and the arrows leaving it. */
export interface ShowroomScene {
  id: string;
  name: L10n;
  image: string;
  links: ShowroomLink[];
}

export interface Project {
  id: string; // URL slug
  cat: "residential" | "commercial";
  status: Status;
  year?: number;
  /** Placeholder art style used when there is no cover photo. */
  kind: ProjectKind;
  cover?: string;
  /** Logo shown on the project page hero and featured block (transparent PNG or any image). */
  logo?: string;
  /** Short slogan used as the featured-block headline. Falls back to the name. */
  tagline?: L10n;
  gallery: GalleryPhoto[];
  /** Video tour link: YouTube (unlisted), Vimeo or a direct .mp4/.webm file. */
  video?: string;
  /** Interactive 360° tour made of linked panoramas. The first scene is the entrance. */
  showroom?: ShowroomScene[];
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

export type VacancyType = "full" | "part" | "remote" | "contract";

export interface Vacancy {
  id: string;
  title: L10n;
  dept: L10n;
  city: L10n;
  type: VacancyType;
  summary: L10n;
  requirements: L10n[];
  /** Hidden vacancies stay in the admin but not on the site. */
  open: boolean;
  createdAt: string;
}

export interface Person {
  name: L10n;
  role: L10n;
  quote: L10n;
  p1: L10n;
  p2: L10n;
  photo?: string;
}

export interface Settings {
  /** Shown on the home page. */
  founder: Person;
  /** Co-founder and CEO: shown on the Careers page. */
  ceo: Person;
  contacts: {
    phone: string;
    email: string;
    address: L10n;
    hours: string;
    instagram: string;
    telegram: string;
  };
}
