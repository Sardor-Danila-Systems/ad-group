/**
 * The built-in showroom panoramas (public/showroom/…) come in two sizes: name.jpg at 8192×4096 for large
 * screens and name-m.jpg at 6144×3072 for phones, tablets and thumbnails. Uploaded panoramas have one size.
 */
export function lightPanorama(src: string) {
  return /^\/showroom\/[\w/-]+\.jpg$/.test(src) && !src.endsWith("-m.jpg") ? src.replace(/\.jpg$/, "-m.jpg") : src;
}

/** Phones and tablets get the lighter file: less to download, and it fits their GPU texture limit. */
export function panoramaFor(src: string) {
  const small = typeof window !== "undefined" && window.matchMedia("(pointer: coarse), (max-width: 1024px)").matches;
  return small ? lightPanorama(src) : src;
}
