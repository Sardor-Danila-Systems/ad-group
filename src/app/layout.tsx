import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Preloader } from "@/components/site/preloader";
import { SiteProvider } from "@/components/site/site-provider";
import { getProjects } from "@/lib/content-source";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "cyrillic-ext"],
});
// Stand-in for Delmon Delicate (Vatan Residence brandbook): the premium serif used for headlines.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
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
  const projects = (await getProjects()).map(({ id, name }) => ({ id, name }));
  return (
    <html
      lang="ru"
      className={`${jakarta.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Suspense fallback={null}>
          <Preloader />
        </Suspense>
        <SiteProvider projects={projects}>
          {children}
          <Toaster />
        </SiteProvider>
      </body>
    </html>
  );
}
