"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0b1221] via-[#152442] to-[#111827] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">DigiGet</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your Loyalty, Everywhere
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={() => router.push("/login/admin")}
            className="w-full rounded-xl bg-[#1E3A5F] py-4 text-lg font-semibold text-white transition hover:bg-[#25446d]"
          >
            🔐 Admin Login
          </button>

          <button
            type="button"
            onClick={() => router.push("/login/shop")}
            className="w-full rounded-xl bg-[#1E3A5F] py-4 text-lg font-semibold text-white transition hover:bg-[#25446d]"
          >
            🏪 Shop Owner Login
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-400">or</span>
            </div>
          </div>

          <a
            href="/signup"
            className="block w-full rounded-xl border-2 border-[#1E3A5F] py-4 text-center text-lg font-semibold text-[#1E3A5F] transition hover:bg-[#eef4ff]"
          >
            Apply for Shop Account
          </a>
        </div>

        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-sm text-blue-900">
          <strong>Customers:</strong> Check in using the NFC tag or QR code at
          your favorite shop.
        </div>
      </div>
    </div>
  );
}
