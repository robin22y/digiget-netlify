"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import type { Shop } from "@/lib/types";

export default function AdminShopDetailPage() {
  const params = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/shops?id=${params.id}`);
      if (!res.ok) return;
      const data = await res.json();
      const match = data.find((item: Shop) => item.id === params.id);
      setShop(match ?? null);
    };
    void load();
  }, [params.id]);

  if (!shop) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Loading shop details...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-foreground">{shop.shop_name}</h1>
        <p className="text-sm text-muted-foreground">{shop.shop_type}</p>
        <div className="text-sm text-muted-foreground">
          <p>{shop.shop_address_line1}</p>
          {shop.shop_address_line2 ? <p>{shop.shop_address_line2}</p> : null}
          <p>{shop.shop_postcode}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Owner: {shop.owner_name}</p>
          <p>Email: {shop.owner_email}</p>
          <p>Phone: {shop.owner_phone}</p>
        </div>
      </Card>
    </div>
  );
}

