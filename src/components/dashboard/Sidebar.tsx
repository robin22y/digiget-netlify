"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  roles: Array<"admin" | "shop" | "customer">;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard/admin", label: "Overview", roles: ["admin"] },
  { href: "/dashboard/admin/applications", label: "Applications", roles: ["admin"] },
  { href: "/dashboard/admin/shops", label: "Shops", roles: ["admin"] },
  { href: "/dashboard/admin/nfc-tags", label: "NFC Tags", roles: ["admin"] },
  { href: "/dashboard/shop", label: "Shop Dashboard", roles: ["shop"] },
  { href: "/dashboard/shop/checkin", label: "Customer Check-in", roles: ["shop"] },
  { href: "/dashboard/customer", label: "My Points", roles: ["customer"] },
];

export interface SidebarProps {
  role: "admin" | "shop" | "customer";
  currentPath: string;
}

export function Sidebar({ role, currentPath }: SidebarProps) {
  const items = React.useMemo(
    () => NAV_ITEMS.filter((item) => item.roles.includes(role)),
    [role]
  );

  return (
    <aside className="hidden w-72 flex-shrink-0 border-r border-border bg-white/80 px-4 py-6 backdrop-blur lg:block dark:bg-slate-900/80">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">DigiGet</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {role === "admin"
            ? "Super Admin"
            : role === "shop"
            ? "Shop Owner"
            : "Customer"}
        </p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const active = currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

