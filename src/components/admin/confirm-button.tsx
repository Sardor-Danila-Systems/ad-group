"use client";

import { Button } from "@/components/ui/button";

/** Submit button that asks for confirmation before the surrounding form posts. */
export function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
