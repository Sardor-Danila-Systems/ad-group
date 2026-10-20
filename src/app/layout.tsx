import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Manrope, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Preloader } from "@/components/site/preloader";
import { SiteProvider } from "@/components/site/site-provider";
import { getProjects, getSettings } from "@/lib/content-source";
import "./globals.css";

// Body: Manrope has full Cyrillic and Latin Extended, so Russian and Uzbek render in the same face.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
});
// Headlines: Playfair Display, a high-contrast luxury serif with Cyrillic and Latin Extended.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
      className={`${manrope.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Suspense fallback={null}>
          <Preloader />
        </Suspense>
        <SiteProvider projects={projects} contacts={settings.contacts}>
          {children}
          <Toaster />
        </SiteProvider>
      </body>
    </html>
  );
}
