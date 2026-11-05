"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuBriefcase, LuBuilding2, LuChevronLeft, LuFileText, LuInbox, LuLayoutDashboard, LuSettings } from "react-icons/lu";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Обзор", Icon: LuLayoutDashboard },
  { href: "/admin/projects", label: "ЖК и проекты", Icon: LuBuilding2 },
  { href: "/admin/news", label: "Новости", Icon: LuFileText },
  { href: "/admin/vacancies", label: "Вакансии", Icon: LuBriefcase },
  { href: "/admin/leads", label: "Заявки", Icon: LuInbox },
  { href: "/admin/settings", label: "Настройки", Icon: LuSettings },
];

/** The section a path belongs to: «Обзор» only for /admin itself, the others also for their sub-pages. */
const isActive = (path: string, href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(`${href}/`));

/** Admin menu with the current section highlighted (gold bar, tint and aria-current). */
export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Разделы">
      {NAV.map(({ href, label, Icon }) => {
        const active = isActive(path, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-gold/15 font-semibold text-gold-deep" : "text-ink/80 hover:bg-gold/10 hover:text-gold-deep",
            )}
          >
            {active && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold lg:inset-x-auto lg:inset-y-2 lg:bottom-auto lg:left-0 lg:h-auto lg:w-0.5" />}
            <Icon className="size-[18px]" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** On a page inside a section (editing a project, a new vacancy…) a crumb back to that section. */
export function AdminCrumb() {
  const path = usePathname();
  const item = NAV.find((n) => n.href !== "/admin" && path.startsWith(`${n.href}/`));
  if (!item) return null;
  const { Icon, label, href } = item;
  return (
    <Link href={href} className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.12em] text-gold-deep uppercase transition-colors hover:text-ink">
      <LuChevronLeft className="size-4" />
      <Icon className="size-4" /> {label}
    </Link>
  );
}
