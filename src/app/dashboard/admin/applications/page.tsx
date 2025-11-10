"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/dashboard/Header";
import type { ShopApplication } from "@/lib/types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ShopApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    void fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApprove = async (appId: string) => {
    if (!confirm("Approve this application?")) return;

    await fetch(`/api/applications/${appId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nfcTagId:
          "DIGIGET-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        trialDays: 30,
      }),
    });

    void fetchApplications();
  };

  const handleReject = async (appId: string) => {
    const reason = prompt("Rejection reason:");
    if (!reason) return;

    await fetch(`/api/applications/${appId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    void fetchApplications();
  };

  if (loading) {
    return (
      <div className="p-6">
        <Header title="Pending Applications" subtitle="Review incoming shops" />
        <p className="mt-6 text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const pending = applications.filter((app) => app.status === "pending");

  return (
    <div className="flex flex-col">
      <Header
        title="Pending Applications"
        subtitle="Approve or reject new DigiGet shops"
      />

      <div className="p-6">
        <Badge variant="secondary">
          {pending.length} pending
        </Badge>

        <div className="mt-6 space-y-4">
          {pending.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              No pending applications 🎉
            </Card>
          ) : null}

          {pending.map((app) => (
            <Card key={app.id} className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {app.shop_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {app.shop_type} • {app.shop_postcode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {app.owner_name} • {app.owner_phone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted{" "}
                    {new Date(app.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button onClick={() => void handleQuickApprove(app.id)}>
                    ✓ Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void handleReject(app.id)}
                  >
                    ✗ Reject
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(`/dashboard/admin/applications/${app.id}`)
                    }
                  >
                    Review
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

