"use client";

import { useActionState } from "react";
import { keepFormSubmit } from "@/components/admin/use-keep-form";
import { login, type FormState } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form onSubmit={keepFormSubmit(action)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="password">Пароль</Label>
        <Input id="password" name="password" type="password" required autoFocus autoComplete="current-password" className="h-11 bg-white" />
      </div>
      {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="h-11 rounded-full bg-ink text-paper hover:bg-ink-2">{pending ? "Вхожу…" : "Войти"}</Button>
    </form>
  );
}
