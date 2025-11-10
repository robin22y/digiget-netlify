"use client";

import { useState } from "react";

import { PhoneInput } from "@/components/auth/PhoneInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/dashboard/Header";

const DEMO_SHOP_ID = "demo-shop-id";

interface CustomerSummary {
  id: string;
  name: string;
  points: number;
  last_visit: string | null;
}

export default function CheckinPage() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState<CustomerSummary | null>(null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    const res = await fetch("/api/customers/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phone }),
    });

    if (res.ok) {
      const data = await res.json();
      setCustomer(data);
    } else {
      setCustomer(null);
    }

    setLoading(false);
  };

  const handleCheckin = async () => {
    setLoading(true);

    await fetch("/api/customers/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId: DEMO_SHOP_ID,
        phoneNumber: phone,
        name: customer ? customer.name : newCustomerName,
      }),
    });

    alert("Check-in successful!");
    setPhone("");
    setCustomer(null);
    setNewCustomerName("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <Header title="Check In Customer" subtitle="Award points in seconds" />
      <div className="p-6">
        <Card className="mx-auto max-w-2xl space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground/80">
              Customer Phone Number
            </label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              placeholder="07XXX XXX XXX"
            />
          </div>

          <Button
            onClick={() => void handleSearch()}
            disabled={!phone || loading}
            className="w-full"
          >
            {loading ? "Searching..." : "Search Customer"}
          </Button>

          {customer ? (
            <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
              <h3 className="text-lg font-semibold text-success">
                Welcome back {customer.name || "Guest"}!
              </h3>
              <p className="text-sm text-muted-foreground">
                Current points: {customer.points}
              </p>
              <p className="text-sm text-muted-foreground">
                Last visit:{" "}
                {customer.last_visit
                  ? new Date(customer.last_visit).toLocaleDateString("en-GB")
                  : "First visit"}
              </p>

              <Button
                onClick={() => void handleCheckin()}
                className="mt-4 w-full"
                size="lg"
              >
                + Add Points
              </Button>
            </div>
          ) : phone && !loading ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <h3 className="text-lg font-semibold text-foreground">
                New Customer
              </h3>
              <p className="text-sm text-muted-foreground">
                First time here? Add an optional name for their profile.
              </p>

              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Customer Name (optional)
                </label>
                <Input
                  value={newCustomerName}
                  onChange={(event) => setNewCustomerName(event.target.value)}
                  placeholder="John Smith"
                />
              </div>

              <Button
                onClick={() => void handleCheckin()}
                className="mt-4 w-full"
                size="lg"
              >
                Check In
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

