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

/** A figure inside a project section, e.g. «46,4 м²» — «площадь лобби». */
export interface ProjectStat {
  /** A plain figure ("46,4 m²") or words that need translating ("up to 1.6 t"). */
  value: string | L10n;
  label: L10n;
}

/** A card in a section laid out as a grid (shops, fitness, kids club…). */
export interface ProjectCard {
  title: L10n;
  text: L10n;
  image?: string;
  stat?: string | L10n;
}

/**
 * A detailed block of the project page (location, architecture, lobby, apartments…), one screen each.
 * With `cards` it is shown as a grid of cards instead of an image beside the text.
 */
export interface ProjectSection {
  id: string;
  eyebrow?: L10n;
  title: L10n;
  text: L10n;
  image?: string;
  stats?: ProjectStat[];
  points?: L10n[];
  cards?: ProjectCard[];
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
  /** Matterport 3D tour (share link https://my.matterport.com/show/?m=...). Shown as the showroom when set. */
  matterport?: string;
  name: L10n;
  desc: L10n;
  long?: L10n;
  /** Price per m² in USD, shown as "from $X". */
  price?: number;
  facts: Fact[];
  features: L10n[];
  /** Detailed blocks shown after the overview (from the project's guidebook). */
  sections?: ProjectSection[];
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

export type DirectionId = "construction" | "service" | "logistics";

/** Admin-managed extras for a business direction on /directions. */
export interface DirectionMedia {
  photo?: string;
  /** Full https://www.instagram.com/<account>/ links; a direction may run several brands. */
  instagram?: string[];
}

export interface Settings {
  /** Shown on the home page («О компании», together with the CEO). */
  founder: Person;
  /** Co-founder and CEO: shown on the home page («О компании») and the Careers page. */
  ceo: Person;
  directions: Partial<Record<DirectionId, DirectionMedia>>;
  contacts: {
    phone: string;
    email: string;
    address: L10n;
    hours: string;
    instagram: string;
    telegram: string;
  };
}
