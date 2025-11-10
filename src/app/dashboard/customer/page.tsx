"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/dashboard/Header";

interface CustomerShopSummary {
  id: string;
  shop_name: string;
  shop_type: string;
  points: number;
  points_needed_for_reward: number;
  progress: number;
  last_visit: string | null;
}

export default function CustomerDashboard() {
  const [shops, setShops] = useState<CustomerShopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const res = await fetch("/api/customers/shops");
      const data = await res.json();
      if (!mounted) return;
      setShops(data);
      setLoading(false);
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col">
      <Header title="My Points" subtitle="Track your loyalty across shops" />
      <div className="p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {shops.map((shop) => (
              <Card
                key={shop.id}
                className="cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
                onClick={() => router.push(`/dashboard/customer/${shop.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {shop.shop_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {shop.shop_type}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {shop.points} pts
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {shop.points_needed_for_reward} points for reward
                    </span>
                    <span>{Math.round((shop.progress ?? 0) * 100)}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min(1, shop.progress ?? 0) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Last visit:{" "}
                  {shop.last_visit
                    ? new Date(shop.last_visit).toLocaleDateString("en-GB")
                    : "No visits yet"}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

