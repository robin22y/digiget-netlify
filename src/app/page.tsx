"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1a2e] via-[#1E3A5F] to-[#0f1a2e]">
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-md dark:bg-slate-900/90">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
              DG
            </div>
            <h1 className="text-4xl font-bold text-foreground">DigiGet</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your loyalty, everywhere.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/login/admin">Super Admin Login</Link>
            </Button>
            <Button asChild size="lg" className="w-full">
              <Link href="/login/shop">Shop Owner Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/checkin/new">Customer Check-In</Link>
            </Button>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            New shop interested in DigiGet?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Apply for your free trial →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
