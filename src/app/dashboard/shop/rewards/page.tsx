"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Reward } from "@/lib/types";

export default function ShopRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/shop/rewards");
      if (res.ok) {
        const data = await res.json();
        setRewards(data);
      }
    };
    void load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Reward tiers
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure how customers earn and redeem rewards.
          </p>
        </div>
        <Button onClick={() => alert("Reward setup coming soon!")}>
          Add reward
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rewards.map((reward) => (
          <Card key={reward.id} className="space-y-2 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {reward.reward_description}
              </h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {reward.points_required} pts
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tier #{reward.reward_order} •{" "}
              {reward.is_active ? "Active" : "Inactive"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

