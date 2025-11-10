"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignupSuccessClient() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-10 text-center shadow-xl dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-foreground">
          Application Submitted ✅
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Thank you for applying to DigiGet. Our team will review your shop and be in touch shortly.
        </p>

        {reference ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/60 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reference Code
            </p>
            <p className="mt-1 text-2xl font-mono text-foreground">{reference}</p>
          </div>
        ) : null}

        <div className="mt-8 space-y-3">
          <Button asChild className="w-full">
            <Link href="/">Return to home</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Need help? Email{" "}
            <a
              href="mailto:support@digiget.co.uk"
              className="font-semibold text-primary hover:underline"
            >
              support@digiget.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

