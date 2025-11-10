"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import type { Role } from "@/lib/types";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ToastProvider } from "@/components/ui/toast";

interface DashboardShellProps {
  role: Role;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <>
      <ToastProvider />
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar role={role} currentPath={pathname} />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </>
  );
}

