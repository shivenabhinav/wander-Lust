"use client";

import { useEffect, useState } from "react";
import { Download, MapPin, Calendar, CheckCircle, X } from "lucide-react";

export default function PastTripsPage() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            try {
                const res = await fetch(`/api/bookings/user?userId=${userId}`);
                const data = await res.json();

                const allBookings = Array.isArray(data) ? data : (data.bookings || []);
                setTrips(allBookings.filter(b => ["completed", "confirmed"].includes(b.status)));
            } catch (err) {
                console.error("Failed to fetch trips", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Trips</h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            ) : trips.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <p className="text-xl text-gray-500 dark:text-gray-400">No trips found.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {trips.map((trip) => (
                        <div key={trip._id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <MapPin className="w-10 h-10" />
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-emerald-600 flex items-center gap-1 shadow-sm">
                                    <CheckCircle className="w-3 h-3" />
                                    PAID
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg mb-1 truncate text-gray-900 dark:text-white">{trip.property?.title || "Unknown Property"}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {trip.property?.location?.city || "Unknown Location"}
                                </p>

                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <Calendar className="w-4 h-4" />
                                    <div>
                                        <div className="font-medium">
                                            {new Date(trip.checkIn).toLocaleDateString()} - {new Date(trip.checkOut).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">₹{trip.totalPrice}</span>
                                    <button
                                        onClick={() => setSelectedTrip(trip)}
                                        className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detailed Receipt Modal */}
            {selectedTrip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-violet-600 p-6 text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold">Payment Receipt</h2>
                                <p className="text-violet-200 text-sm mt-1">Thank you for traveling with us!</p>
                            </div>
                            <button onClick={() => setSelectedTrip(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Stay Name */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Stay Name</label>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedTrip.property?.title}</p>
                            </div>

                            {/* Place */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Place / Location</label>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 text-violet-500" />
                                    <span>{selectedTrip.property?.location?.city || selectedTrip.property?.location?.address}</span>
                                </div>
                            </div>

                            {/* UPI / Payment ID */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">UPI Payment ID</label>
                                <div className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 break-all border border-gray-200 dark:border-gray-700">
                                    {selectedTrip.razorpayPaymentId || "N/A"}
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Host Payout (75%)</span>
                                    <span>₹{selectedTrip.hostPayout || (selectedTrip.totalPrice * 0.75).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500 pb-2">
                                    <span>Platform Fee (25%)</span>
                                    <span>₹{selectedTrip.platformFee || (selectedTrip.totalPrice * 0.25).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-2">
                                    <span className="font-medium text-gray-500">Total Amount Paid</span>
                                    <span className="text-2xl font-bold text-emerald-600">₹{selectedTrip.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center">
                            <button onClick={() => setSelectedTrip(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-medium text-sm w-full py-2">
                                Close Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
