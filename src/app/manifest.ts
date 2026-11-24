import type { MetadataRoute } from "next";

// Icons are made by scripts/make-icons.mjs (tab icons and the iPhone one are src/app/icon.svg, favicon.ico
// and apple-icon.png, which Next links itself).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AD Group — строительная компания",
    short_name: "AD Group",
    start_url: "/",
    display: "browser",
    background_color: "#f5f0e6",
    theme_color: "#f5f0e6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
