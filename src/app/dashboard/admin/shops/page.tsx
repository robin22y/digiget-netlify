"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/dashboard/Header";
import type { Shop } from "@/lib/types";

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/shops");
      if (res.ok) {
        const data = await res.json();
        setShops(data);
      }
    };
    void load();
  }, []);

  return (
    <div className="flex flex-col">
      <Header title="All Shops" subtitle="Manage every DigiGet location" />
      <div className="grid gap-4 p-6 md:grid-cols-2">
        {shops.map((shop) => (
          <Card key={shop.id} className="space-y-2 p-6">
            <h3 className="text-xl font-semibold text-foreground">
              {shop.shop_name}
            </h3>
            <p className="text-sm text-muted-foreground">{shop.shop_type}</p>
            <p className="text-sm text-muted-foreground">{shop.shop_postcode}</p>
            <p className="text-xs text-muted-foreground">
              Owner: {shop.owner_name} ({shop.owner_phone})
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

