"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userType: "admin",
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      router.push("/dashboard/admin");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1221] via-[#152442] to-[#111827] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1E3A5F] text-2xl text-white">
            🔐
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Super admin secure area
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="robin@digiget.uk"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full rounded-xl bg-[#1E3A5F] py-3 text-base font-semibold text-white transition hover:bg-[#25446d] disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

