"use client";

import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hostId = localStorage.getItem("userId");
    if (!hostId) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        // Reuse Dashboard API to get all bookings
        const res = await fetch("/api/host/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hostId }),
        });
        const data = await res.json();

        if (data.allBookings) {
          setBookings(data.allBookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading bookings...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">All Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No bookings received yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-4">Guest</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Check-in</th>
                  <th className="p-4">Check-out</th>
                  <th className="p-4">Your Payout</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{b.user?.name || "Guest"}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{b.property?.title || "N/A"}</td>
                    <td className="p-4 text-gray-500">{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-500">{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-emerald-600">₹{b.hostPayout || 0}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                          b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                            b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                        }`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
