"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/auth/PinInput";

export default function AdminLoginClient() {
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: "admin", phone, pin }),
      });

      if (!res.ok) {
        throw new Error("Invalid PIN");
      }

      const result = await res.json();
      if (result.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to verify PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Super admin secure area
        </p>

        <div className="mt-6 space-y-4 text-left">
          <div className="rounded-lg bg-muted px-4 py-3 text-sm text-foreground">
            <p className="font-semibold">Phone</p>
            <p>{phone || "Not provided"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                {error}
              </p>
            ) : null}

            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-foreground">
                Enter 6-digit PIN
              </p>
              <PinInput length={6} value={pin} onChange={setPin} />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={pin.length !== 6 || loading}
            >
              {loading ? "Verifying..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

