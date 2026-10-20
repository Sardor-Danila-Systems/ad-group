import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LuExternalLink, LuFileText, LuInbox, LuLayoutDashboard, LuLogOut, LuBuilding2 } from "react-icons/lu";
import { logout } from "@/actions/admin";
import { RouteLoader } from "@/components/site/preloader";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Админка AD Group", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Обзор", Icon: LuLayoutDashboard },
  { href: "/admin/projects", label: "ЖК и проекты", Icon: LuBuilding2 },
  { href: "/admin/news", label: "Новости", Icon: LuFileText },
  { href: "/admin/leads", label: "Заявки", Icon: LuInbox },
];

async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-svh bg-muted/50 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-border bg-paper p-4 lg:sticky lg:top-0 lg:h-svh lg:border-r lg:border-b-0 lg:p-6">
        <Link href="/admin" className="mb-4 block lg:mb-8">
          <Image src="/assets/logo-ad-gold.png" alt="AD Group" width={140} height={23} className="h-[22px] w-auto" />
        </Link>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-gold/10 hover:text-gold-deep">
              <Icon className="size-[18px]" /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 flex gap-2 lg:mt-10 lg:flex-col">
          <Button asChild variant="outline" size="sm" className="justify-start gap-2"><Link href="/" target="_blank"><LuExternalLink /> Открыть сайт</Link></Button>
          <form action={logout}><Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2"><LuLogOut /> Выйти</Button></form>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-8">{children}</main>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
