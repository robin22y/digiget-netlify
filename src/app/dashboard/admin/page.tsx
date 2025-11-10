"use client";

import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default function AdminDashboardPage() {
  const stats = {
    activeShops: 12,
    pendingApplications: 3,
    totalCustomers: 842,
  };

  return (
    <div className="flex flex-col">
      <Header title="Admin Overview" subtitle="Platform performance at a glance" />
      <div className="grid gap-4 p-6 md:grid-cols-3">
        <StatsCard
          title="Active Shops"
          value={stats.activeShops}
          helperText="Subscriptions currently active"
          trend={{ direction: "up", value: "12%" }}
        />
        <StatsCard
          title="Pending Applications"
          value={stats.pendingApplications}
          helperText="Awaiting review"
          trend={{ direction: "down", value: "2" }}
        />
        <StatsCard
          title="Customers"
          value={stats.totalCustomers}
          helperText="Registered across all shops"
          trend={{ direction: "up", value: "5%" }}
        />
      </div>
    </div>
  );
}

