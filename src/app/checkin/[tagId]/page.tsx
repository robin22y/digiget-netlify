"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NfcCheckinPage() {
  const params = useParams<{ tagId: string }>();
  const [status] = useState<"waiting" | "success" | "error">(() => {
    if (typeof window === "undefined") return "waiting";
    return "NDEFReader" in window ? "success" : "error";
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-foreground">Tap to Check In</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tag ID: {params.tagId}
        </p>

        {status === "waiting" && (
          <p className="mt-6 text-sm text-muted-foreground">
            Initialising NFC reader...
          </p>
        )}

        {status === "success" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Hold your device near the NFC tag to check in.
            </p>
            <Button
              className="w-full"
              onClick={() => alert("Demo check-in recorded!")}
            >
              Simulate check-in
            </Button>
          </div>
        )}

        {status === "error" && (
          <p className="mt-6 text-sm text-danger">
            NFC not supported on this device. Please use the QR fallback.
          </p>
        )}
      </div>
    </div>
  );
}

