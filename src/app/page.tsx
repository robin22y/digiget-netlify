"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PhoneInput } from "@/components/auth/PhoneInput";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      if (!res.ok) {
        throw new Error("Unable to identify user");
      }

      const { role } = await res.json();

      if (role === "admin") {
        router.push(`/login/admin?phone=${encodeURIComponent(phone)}`);
      } else if (role === "shop") {
        router.push(`/login/shop?phone=${encodeURIComponent(phone)}`);
      } else if (role === "shop_pending") {
        router.push("/activate/pending");
      } else if (role === "customer") {
        router.push(`/checkin/new?phone=${encodeURIComponent(phone)}`);
      } else {
        router.push(`/checkin/new?phone=${encodeURIComponent(phone)}`);
      }
    } catch (error) {
      console.error(error);
      alert("We could not verify that number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground/80">
                Enter your phone number
              </label>
              <PhoneInput value={phone} onChange={setPhone} />
            </div>

            <Button
              onClick={() => void handleContinue()}
              disabled={!phone || loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Checking..." : "Continue"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <span className="mr-1">New shop?</span>
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Apply here →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
