"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";

interface ShopDetail {
  id: string;
  shop_name: string;
  reward_description: string;
  points_per_visit: number;
  points_balance: number;
  transactions: Array<{
    id: string;
    created_at: string;
    points_change: number;
    transaction_type: string;
  }>;
}

export default function CustomerShopDetailPage() {
  const params = useParams<{ shopId: string }>();
  const [detail, setDetail] = useState<ShopDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/customers/shops/${params.shopId}`);
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      }
    };
    void load();
  }, [params.shopId]);

  if (!detail) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Loading shop details...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {detail.shop_name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Reward: {detail.reward_description}
        </p>
        <p className="text-sm text-muted-foreground">
          Points needed: {detail.points_per_visit}
        </p>
        <p className="text-lg font-semibold text-foreground">
          Your balance: {detail.points_balance} pts
        </p>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
        <div className="mt-4 space-y-3">
          {detail.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {new Date(transaction.created_at).toLocaleDateString("en-GB")}
              </span>
              <span className="font-semibold text-foreground">
                {transaction.points_change > 0 ? "+" : ""}
                {transaction.points_change} pts
              </span>
              <span className="text-muted-foreground">
                {transaction.transaction_type}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

