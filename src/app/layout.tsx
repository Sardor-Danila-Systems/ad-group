import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lexend_Giga, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Preloader } from "@/components/site/preloader";
import { SiteProvider } from "@/components/site/site-provider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "cyrillic-ext"],
});
// Stand-in for Cairo Now Extended (brandbook headline font).
const giga = Lexend_Giga({
  variable: "--font-giga",
  subsets: ["latin"],
});
// Stand-in for Delmon Delicate (Vatan Residence brandbook).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "AD Group — строительная компания",
  description:
    "Демо-сайт строительной компании AD Group: жилые и коммерческие комплексы, Vatan Residence, инвестиционный калькулятор.",
  icons: { icon: "/assets/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#171F38" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${jakarta.variable} ${giga.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Preloader />
        <SiteProvider>
          {children}
          <Toaster />
        </SiteProvider>
      </body>
    </html>
  );
}
