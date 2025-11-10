"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EmailInput } from "@/components/auth/EmailInput";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetch("/api/recovery/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-foreground">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll email you a secure reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <EmailInput value={email} onChange={setEmail} />
          <Button type="submit" className="w-full" disabled={!email}>
            {submitted ? "Email sent" : "Send reset link"}
          </Button>
        </form>
      </div>
    </div>
  );
}

