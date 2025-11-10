"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function ShopSettingsPage() {
  const [shopName, setShopName] = useState("Demo Shop");
  const [pointsPerVisit, setPointsPerVisit] = useState(10);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);

  const handleSave = async () => {
    await fetch("/api/shop/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopName, pointsPerVisit, loyaltyEnabled }),
    });
    alert("Settings saved");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-foreground">Shop settings</h1>
      <p className="text-sm text-muted-foreground">
        Update business details and loyalty preferences.
      </p>

      <Card className="mt-6 space-y-6 p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            Shop name
          </label>
          <Input
            value={shopName}
            onChange={(event) => setShopName(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            Points per visit
          </label>
          <Input
            type="number"
            min={1}
            value={pointsPerVisit}
            onChange={(event) => setPointsPerVisit(Number(event.target.value))}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Enable loyalty program
            </p>
            <p className="text-xs text-muted-foreground">
              Allow customers to earn points and rewards
            </p>
          </div>
          <Switch
            checked={loyaltyEnabled}
            onCheckedChange={setLoyaltyEnabled}
          />
        </div>

        <Button onClick={() => void handleSave()} className="w-full sm:w-auto">
          Save changes
        </Button>
      </Card>
    </div>
  );
}

