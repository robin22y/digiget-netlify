"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-700">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-900 mb-2">DigiGet</h1>
          <p className="text-gray-600">Your Loyalty, Everywhere</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/login/admin")}
            className="w-full bg-navy-900 text-white py-4 rounded-lg hover:bg-navy-800 transition-all font-semibold text-lg"
          >
            🔐 Admin Login
          </button>

          <button
            onClick={() => router.push("/login/shop")}
            className="w-full bg-navy-900 text-white py-4 rounded-lg hover:bg-navy-800 transition-all font-semibold text-lg"
          >
            🏪 Shop Owner Login
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>

          <a
            href="/signup"
            className="block w-full text-center bg-white border-2 border-navy-900 text-navy-900 py-4 rounded-lg hover:bg-navy-50 transition-all font-semibold text-lg"
          >
            Apply for Shop Account
          </a>
        </div>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center text-sm text-blue-900">
          <strong>Customers:</strong> Check in using the NFC tag or QR code at
          your favorite shop.
        </div>
      </div>
    </div>
  );
}
