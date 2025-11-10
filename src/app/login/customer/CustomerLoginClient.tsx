"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CustomerLoginClient() {
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const router = useRouter();

  useEffect(() => {
    const target = `/checkin/new?phone=${encodeURIComponent(phone)}`;
    router.replace(target);
  }, [phone, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-xl dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-foreground">
          Check In Required
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Customers access their points immediately after tapping the NFC tag or
          scanning the QR code at the shop. Please use the in-store tablet or
          QR code to continue.
        </p>
      </div>
    </div>
  );
}

