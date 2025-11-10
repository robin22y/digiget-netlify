"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AuthMethodSelector } from "@/components/auth/AuthMethodSelector";
import { PinInput } from "@/components/auth/PinInput";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function ShopLoginClient() {
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";

  const [method, setMethod] = useState<"pin" | "password">("pin");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({
          role: "shop",
          phone,
          pin: method === "pin" ? pin : undefined,
          password: method === "password" ? password : undefined,
        }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      window.location.href = "/dashboard/shop";
    } catch (err) {
      console.error(err);
      setError("Unable to login. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-foreground">Shop Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Phone verified for {phone || "your account"}
        </p>

        <div className="mt-6">
          <AuthMethodSelector value={method} onChange={setMethod} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error ? (
            <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          {method === "pin" ? (
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                Enter your 6-digit owner PIN
              </p>
              <PinInput length={6} value={pin} onChange={setPin} />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Password
              </label>
              <PasswordInput value={password} onChange={setPassword} />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || (method === "pin" ? pin.length < 6 : password.length < 8)}
          >
            {loading ? "Signing in..." : "Continue"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Forgot details?{" "}
          <a className="font-semibold text-primary hover:underline" href="/forgot-pin">
            Reset PIN
          </a>{" "}
          or{" "}
          <a className="font-semibold text-primary hover:underline" href="/forgot-password">
            reset password
          </a>
          .
        </p>
      </div>
    </div>
  );
}

