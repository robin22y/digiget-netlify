import type { ReactNode } from "react";
import { cookies } from "next/headers";

import type { Role } from "@/lib/types";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const roleCookie = cookieStore.get("dg_role")?.value as Role | undefined;
  const role: Role = roleCookie ?? "shop";

  return <DashboardShell role={role}>{children}</DashboardShell>;
}

