import type { ReactNode } from "react";
import { cookies } from "next/headers";

import type { Role } from "@/lib/types";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const roleCookie = cookies().get("dg_role")?.value as Role | undefined;
  const role: Role = roleCookie ?? "shop";

  return <DashboardShell role={role}>{children}</DashboardShell>;
}

