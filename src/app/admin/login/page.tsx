import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";
import { adminEnabled } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Вход — админка AD Group", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-marble px-4">
      <div className="w-full max-w-sm rounded-3xl bg-paper p-8 shadow-xl ring-1 ring-gold/30">
        <Image src="/assets/logo-ad-gold.png" alt="AD Group" width={160} height={26} className="mb-8 h-6 w-auto" />
        <h1 className="mb-6 font-display text-3xl font-medium">Админка</h1>
        {adminEnabled() ? <LoginForm /> : <p className="text-sm text-muted-foreground">Админка выключена. Задайте ADMIN_PASSWORD и SESSION_SECRET в переменных окружения и перезапустите сервер.</p>}
      </div>
    </main>
  );
}
