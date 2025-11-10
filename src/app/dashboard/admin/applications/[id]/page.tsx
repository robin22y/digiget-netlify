"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ShopApplication } from "@/lib/types";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const [application, setApplication] = useState<ShopApplication | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/applications?id=${params.id}`);
      const data = await res.json();
      const match = data.find((item: ShopApplication) => item.id === params.id);
      setApplication(match ?? null);
    };
    void load();
  }, [params.id]);

  if (!application) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {application.shop_name}
        </h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">
              Shop details
            </h2>
            <p className="text-sm text-foreground">{application.shop_type}</p>
            <p className="text-sm text-muted-foreground">
              {application.shop_address_line1}
              {application.shop_address_line2
                ? `, ${application.shop_address_line2}`
                : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {application.shop_postcode}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">
              Owner
            </h2>
            <p className="text-sm text-foreground">{application.owner_name}</p>
            <p className="text-sm text-muted-foreground">
              {application.owner_email}
            </p>
            <p className="text-sm text-muted-foreground">
              {application.owner_phone}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Loyalty Settings
          </h2>
          <p className="text-sm text-foreground">
            {application.points_per_visit} points per visit
          </p>
          <p className="text-sm text-muted-foreground">
            Reward: {application.reward_description}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Button onClick={() => window.alert("Implement approval flow!")}>
            Approve Application
          </Button>
        </div>
      </Card>
    </div>
  );
}

