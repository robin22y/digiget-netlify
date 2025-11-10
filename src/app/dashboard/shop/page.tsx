"use client";

import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ShopDashboardPage() {
  const stats = {
    todayPoints: 48,
    activeRewards: 3,
    trustedDevices: 2,
  };

  return (
    <div className="flex flex-col">
      <Header title="Shop Dashboard" subtitle="Pulse of your loyalty program" />

      <div className="grid gap-4 p-6 md:grid-cols-3">
        <StatsCard
          title="Points awarded today"
          value={stats.todayPoints}
          helperText="Across all customer check-ins"
          trend={{ direction: "up", value: "18%" }}
        />
        <StatsCard
          title="Live rewards"
          value={stats.activeRewards}
          helperText="Active reward tiers"
        />
        <StatsCard
          title="Trusted devices"
          value={stats.trustedDevices}
          helperText="Devices approved for check-in"
        />
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        <Card className="space-y-3 p-6">
          <h2 className="text-lg font-semibold text-foreground">Next actions</h2>
          <p className="text-sm text-muted-foreground">
            Keep your loyalty program fresh with these quick wins.
          </p>
          <div className="space-y-2 text-sm">
            <p>• Add a new seasonal reward</p>
            <p>• Invite staff to use NFC check-in</p>
            <p>• Send a re-engagement SMS</p>
          </div>
          <Button className="mt-4">Manage rewards</Button>
        </Card>

        <Card className="space-y-3 p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Quick access
          </h2>
          <div className="grid gap-2 text-sm">
            <Button variant="outline" className="justify-start">
              Open customer check-in
            </Button>
            <Button variant="outline" className="justify-start">
              View customer list
            </Button>
            <Button variant="outline" className="justify-start">
              Configure trusted devices
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

