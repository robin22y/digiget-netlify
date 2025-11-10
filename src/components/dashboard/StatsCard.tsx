"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  helperText?: string;
  trend?: {
    direction: "up" | "down";
    value: string;
  };
}

export function StatsCard({
  title,
  value,
  helperText,
  trend,
  className,
  ...props
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-slate-900/70",
        className
      )}
      {...props}
    >
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-semibold text-foreground">{value}</span>
        {trend ? (
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wide",
              trend.direction === "up" ? "text-success" : "text-danger"
            )}
          >
            {trend.direction === "up" ? "▲" : "▼"} {trend.value}
          </span>
        ) : null}
      </div>
      {helperText ? (
        <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

