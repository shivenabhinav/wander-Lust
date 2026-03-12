"use client";
import { useEffect, useState } from "react";
import { MapPin, Calendar, Users, ChevronRight } from "lucide-react";

export default function UpcomingTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUpcoming = async () => {
      try {
        const res = await fetch(`/api/bookings/user/${userId}`);
        const data = await res.json();

        if (data.success) {
          setTrips(data.bookings); // Data is already filtered by the API (check-in >= today)
        }
      } catch (err) {
        console.error("Failed to fetch upcoming trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Upcoming Trips</h2>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800">
          {trips.length} Booked
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No upcoming adventures planned yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col md:flex-row"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
                <img
                  src={trip.property?.images?.[0] || "/placeholder-property.jpg"}
                  alt={trip.property?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-blue-600 rounded-lg shadow-xl">
                    {trip.property?.propertyType || "Stay"}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{trip.property?.title}</h3>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg">₹{trip.totalPrice}</span>
                  </div>

                  <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {trip.property?.location?.city || "Discovery Place"}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{new Date(trip.checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{trip.guests} {trip.guests > 1 ? 'Guests' : 'Guest'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Confirmed & Paid</span>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                    Manage Stay <ChevronRight className="w-4 h-4" />
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
