"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalEarnings: 0,
    earningsThisMonth: 0,
    pendingRequests: 0,
    recentBookings: [],
  });

  useEffect(() => {
    const loadDashboard = async () => {
      const hostId = localStorage.getItem("userId");
      if (!hostId) return;

      const res = await fetch("/api/host/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId }),
      });

      const data = await res.json();
      setStats(data);
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Host Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Earnings", value: `₹${stats.totalEarnings}` },
          { label: "Bookings", value: stats.totalBookings },
          { label: "Month Earnings", value: `₹${stats.earningsThisMonth}` },
          { label: "Properties", value: stats.totalProperties },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-violet-600 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          Recent Bookings
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="p-3 rounded-l-lg">Guest</th>
                <th className="p-3">Property</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Payout</th>
                <th className="p-3 rounded-r-lg">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {stats.recentBookings.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan="5">
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                stats.recentBookings.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-3 font-medium text-gray-900 dark:text-white">
                      {b.user?.name || "Guest"}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {b.property?.title || "Unknown Property"}
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      ₹{b.hostPayout || 0}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                          b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                            b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                        }`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
