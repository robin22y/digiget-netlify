"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function ResetPasswordTokenPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    await fetch(`/api/recovery/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: params.token, password }),
    });
    setLoading(false);
    router.push("/login/shop");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-foreground">
          Choose a new password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Token: {params.token.slice(0, 6)}...
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              New password
            </label>
            <PasswordInput value={password} onChange={setPassword} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Confirm password
            </label>
            <PasswordInput value={confirmPassword} onChange={setConfirmPassword} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Reset password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

