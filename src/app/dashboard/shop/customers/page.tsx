"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ShopCustomer {
  id: string;
  name: string | null;
  phone_number: string;
  points: number;
  last_visit_at: string | null;
}

export default function ShopCustomersPage() {
  const [customers, setCustomers] = useState<ShopCustomer[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/shop/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    };
    void load();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Track loyalty and visits for your shop.
          </p>
        </div>
        <Button onClick={() => alert("Export coming soon!")}>Export CSV</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {customers.map((customer) => (
          <Card key={customer.id} className="space-y-2 p-6">
            <h3 className="text-lg font-semibold text-foreground">
              {customer.name || "Guest"}
            </h3>
            <p className="text-sm text-muted-foreground">{customer.phone_number}</p>
            <p className="text-sm text-muted-foreground">
              Points: {customer.points}
            </p>
            <p className="text-xs text-muted-foreground">
              Last visit:{" "}
              {customer.last_visit_at
                ? new Date(customer.last_visit_at).toLocaleDateString("en-GB")
                : "No visits"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

