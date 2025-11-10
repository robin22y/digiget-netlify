"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalShops: 0,
    pendingApplications: 0,
    activeShops: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    void fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy-900 p-6 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">DigiGet Admin</h1>
            <p className="text-navy-300">Super Admin Dashboard</p>
          </div>
          <button
            onClick={() => {
              // TODO: wire up real logout
            }}
            className="rounded bg-navy-700 px-4 py-2 hover:bg-navy-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">Total Shops</div>
            <div className="mt-2 text-3xl font-bold text-navy-900">
              {stats.totalShops}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">
              Pending Applications
            </div>
            <div className="mt-2 text-3xl font-bold text-orange-600">
              {stats.pendingApplications}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">Active Shops</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {stats.activeShops}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="text-sm font-medium text-gray-500">
              Monthly Revenue
            </div>
            <div className="mt-2 text-3xl font-bold text-navy-900">
              £{stats.totalRevenue}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              onClick={() => router.push("/dashboard/admin/applications")}
              className="rounded-lg bg-navy-900 p-4 text-left text-white hover:bg-navy-800"
            >
              <div className="font-semibold">Review Applications</div>
              <div className="mt-1 text-sm text-navy-300">
                {stats.pendingApplications} pending
              </div>
            </button>

            <button
              onClick={() => router.push("/dashboard/admin/shops")}
              className="rounded-lg bg-navy-900 p-4 text-left text-white hover:bg-navy-800"
            >
              <div className="font-semibold">Manage Shops</div>
              <div className="mt-1 text-sm text-navy-300">View all shops</div>
            </button>

            <button
              onClick={() => router.push("/dashboard/admin/nfc-tags")}
              className="rounded-lg bg-navy-900 p-4 text-left text-white hover:bg-navy-800"
            >
              <div className="font-semibold">NFC Tags</div>
              <div className="mt-1 text-sm text-navy-300">
                Generate &amp; assign
              </div>
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Recent Activity</h2>
          <div className="space-y-4">
            <div className="py-8 text-center text-gray-500">
              No recent activity
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

