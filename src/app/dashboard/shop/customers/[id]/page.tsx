"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";

interface CustomerDetail {
  id: string;
  name: string | null;
  phone_number: string;
  points_balance: number;
  total_visits: number;
  last_visit_at: string | null;
}

export default function ShopCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/shop/customers?id=${params.id}`);
      if (res.ok) {
        const data = await res.json();
        const match = data.find((item: CustomerDetail) => item.id === params.id);
        setCustomer(match ?? null);
      }
    };
    void load();
  }, [params.id]);

  if (!customer) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Loading customer...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="space-y-4 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {customer.name || "Guest"}
          </h1>
          <p className="text-sm text-muted-foreground">{customer.phone_number}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Points balance
            </p>
            <p className="text-xl font-semibold text-foreground">
              {customer.points_balance}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Visits</p>
            <p className="text-xl font-semibold text-foreground">
              {customer.total_visits}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Last visit
            </p>
            <p className="text-xl font-semibold text-foreground">
              {customer.last_visit_at
                ? new Date(customer.last_visit_at).toLocaleDateString("en-GB")
                : "Never"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

