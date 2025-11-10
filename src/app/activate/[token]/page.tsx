"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ActivateShopPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [status] = useState<"loading" | "success" | "error">("success");
  const tokenPreview = params.token?.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-10 text-center shadow-xl dark:bg-slate-900">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-semibold text-foreground">
              Activating your shop
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we verify your activation token.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-semibold text-success">
              Shop activated!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You can now set your password and PIN to access DigiGet.
            </p>
            {tokenPreview ? (
              <p className="text-xs text-muted-foreground">
                Token reference: {tokenPreview}…
              </p>
            ) : null}
            <Button className="mt-6 w-full" onClick={() => router.push("/login/shop")}>
              Continue to login
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-semibold text-danger">
              Activation failed
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The activation link is invalid or has expired. Contact support for help.
            </p>
            <Button className="mt-6 w-full" onClick={() => router.push("/")}>
              Return home
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

