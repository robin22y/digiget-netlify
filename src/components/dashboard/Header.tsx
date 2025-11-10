"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onLogout?: () => Promise<void> | void;
}

export function Header({ title, subtitle, onLogout }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-white/70 p-6 backdrop-blur dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {onLogout ? (
        <Button
          variant="outline"
          className="w-full gap-2 sm:w-auto"
          onClick={() => void onLogout()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      ) : null}
    </header>
  );
}

