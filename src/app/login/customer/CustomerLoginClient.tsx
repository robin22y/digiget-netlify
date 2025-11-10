"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/auth/PinInput";

export default function CustomerLoginClient() {
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
        body: JSON.stringify({ role: "customer", phone, pin }),
      });

      if (!res.ok) throw new Error("Invalid PIN");

      const result = await res.json();
      if (result.role === "customer") {
        router.push("/dashboard/customer");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Incorrect PIN. Try again or request a reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your 4-digit PIN to view your points.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error ? (
            <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <PinInput length={4} value={pin} onChange={setPin} />

          <Button
            type="submit"
            className="w-full"
            disabled={pin.length !== 4 || loading}
          >
            {loading ? "Checking..." : "View my points"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Forgot your PIN? Ask any DigiGet shop to reset it for you.
        </p>
      </div>
    </div>
  );
}

