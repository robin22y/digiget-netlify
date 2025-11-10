"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const params = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token }),
      });
      setStatus(res.ok ? "success" : "error");
    };
    void run();
  }, [params.token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-xl dark:bg-slate-900">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-semibold text-foreground">
              Verifying email...
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we verify your link.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-semibold text-success">
              Email verified!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks for confirming. You can now close this tab.
            </p>
            <Button className="mt-6 w-full" onClick={() => (window.location.href = "/")}>
              Return home
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-semibold text-danger">
              Verification failed
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The link may have expired. Request a new verification email.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

