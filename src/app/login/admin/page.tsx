"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function AdminLoginPage() {
  const params = useSearchParams();
  const prefilledPhone = params.get("phone") ?? "";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(prefilledPhone);
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
        body: JSON.stringify({ role: "admin", email, phone, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      window.location.href = "/dashboard/admin";
    } catch (err) {
      console.error(err);
      setError("Unable to login. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-foreground">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Secure access for DigiGet team.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? (
            <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Email
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Registered Phone
            </label>
            <Input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Password
            </label>
            <PasswordInput value={password} onChange={setPassword} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

