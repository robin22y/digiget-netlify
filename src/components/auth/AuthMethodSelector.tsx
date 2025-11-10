"use client";

import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthMethod = "pin" | "password";

export interface AuthMethodSelectorProps {
  value: AuthMethod;
  onChange: (method: AuthMethod) => void;
}

const options: Array<{ value: AuthMethod; label: string; description: string }> =
  [
    {
      value: "pin",
      label: "6-digit PIN",
      description: "Quick access for staff & customers",
    },
    {
      value: "password",
      label: "Email & password",
      description: "Full security for account owners",
    },
  ];

export function AuthMethodSelector({
  value,
  onChange,
}: AuthMethodSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = option.value === "pin" ? Lock : ShieldCheck;
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex w-full flex-col items-start gap-2 rounded-2xl border border-border bg-white p-4 text-left shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:bg-slate-900",
              isActive && "border-primary ring-2 ring-primary/40"
            )}
          >
            <span
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-primary",
                isActive && "bg-primary text-white"
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {option.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

