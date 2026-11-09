import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Manrope, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Motion } from "@/components/site/motion";
import { Preloader } from "@/components/site/preloader";
import { SiteProvider } from "@/components/site/site-provider";
import { getProjects, getSettings } from "@/lib/content-source";
import "./globals.css";

// Body: Manrope has full Cyrillic and Latin Extended, so Russian and Uzbek render in the same face.
// Only the subsets the three languages need are preloaded (cyrillic-ext is for other Cyrillic languages).
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic"],
});
// Headlines: Playfair Display, a high-contrast luxury serif with Cyrillic and Latin Extended.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});
// The italic is used for one quote only: loaded when that quote is drawn, not with every page.
const playfairItalic = Playfair_Display({
  variable: "--font-playfair-italic",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500"],
  style: "italic",
  preload: false,
});

export const metadata: Metadata = {
  title: "AD Group — строительная компания",
  description:
    "Демо-сайт строительной компании AD Group: жилые и коммерческие комплексы, Vatan Residence, инвестиционный калькулятор.",
  icons: { icon: "/assets/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#F5F0E6" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [all, settings] = await Promise.all([getProjects(), getSettings()]);
  const projects = all.map(({ id, name }) => ({ id, name }));
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${playfair.variable} ${playfairItalic.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Suspense fallback={null}>
          <Preloader />
          <Motion />
        </Suspense>
        <SiteProvider projects={projects} contacts={settings.contacts}>
          {children}
          <Toaster />
        </SiteProvider>
      </body>
    </html>
  );
}
