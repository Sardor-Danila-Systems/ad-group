import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// Everything but the admin panel is open to crawlers, the icons too (Google shows /favicon.ico in results).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
