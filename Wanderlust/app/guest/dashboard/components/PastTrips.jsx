"use client";
import { useEffect, useState } from "react";
import { MapPin, Calendar, Clock, ChevronRight } from "lucide-react";

export default function PastTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPast = async () => {
      try {
        const res = await fetch(`/api/bookings/user?userId=${userId}&type=past`);
        const data = await res.json();

        if (data.success) {
          setTrips(data.bookings);
        }
      } catch (err) {
        console.error("Failed to fetch past trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPast();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Travel History</h2>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full border border-gray-200 dark:border-gray-600">
          {trips.length} Finished
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No past journeys yet. Time to explore!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row opacity-80 hover:opacity-100"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-48 h-32 md:h-auto overflow-hidden bg-gray-100">
                <img
                  src={trip.property?.images?.[0] || "/placeholder-property.jpg"}
                  alt={trip.property?.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Info Section */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{trip.property?.title}</h3>
                    <span className="text-gray-900 dark:text-white font-black text-md">₹{trip.totalPrice}</span>
                  </div>

                  <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-medium mb-3">
                    <MapPin className="w-3 h-3" />
                    {trip.property?.location?.city || "Stayed Here"}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg w-fit">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{new Date(trip.checkIn).toLocaleDateString()} - {new Date(trip.checkOut).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Trip Completed</span>
                  </div>
                  <button className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
