"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/bookings/user/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);
                }
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 text-lg">Loading your trips...</p>
            </div>
        );
    }

    const today = new Date();
    const upcoming = bookings.filter((b) => new Date(b.checkIn) >= today);
    const past = bookings.filter((b) => new Date(b.checkIn) < today);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        My Bookings
                    </h1>
                    <Link
                        href="/"
                        className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            No trips yet!
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Time to dust off your bags and start planning your next adventure.
                        </p>
                        <Link
                            href="/explore"
                            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Start Exploring
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Upcoming Trips */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                ✈️ Upcoming Trips
                            </h2>
                            {upcoming.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {upcoming.map((booking) => (
                                        <BookingCard key={booking._id} booking={booking} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No upcoming trips scheduled.</p>
                            )}
                        </section>

                        {/* Past Trips */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                🧳 Past Adventures
                            </h2>
                            {past.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {past.map((booking) => (
                                        <BookingCard key={booking._id} booking={booking} isPast />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No past trips yet.</p>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}

function BookingCard({ booking, isPast }) {
    const { property, checkIn, checkOut, totalPrice, status } = booking;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition border border-gray-100 dark:border-gray-700">
            {/* Image */}
            <div className="relative w-full sm:w-48 h-48">
                <Image
                    src={property?.images?.[0] || "/property-placeholder.jpg"}
                    alt={property?.title || "Property"}
                    fill
                    className={`object-cover ${isPast ? "grayscale" : ""}`}
                />
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">
                            {property?.title}
                        </h3>
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${status === "confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : status === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {status}
                        </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <p className="flex items-center gap-2">
                            <MapPin size={16} /> {property?.location?.city || "Unknown City"}
                        </p>
                        <p className="flex items-center gap-2">
                            <Calendar size={16} />{" "}
                            {new Date(checkIn).toLocaleDateString()} -{" "}
                            {new Date(checkOut).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center border-t pt-3 dark:border-gray-700">
                    <p className="font-bold text-blue-600">₹{totalPrice}</p>

                    <Link
                        href={`/properties/${property?._id}`}
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-1"
                    >
                        View Details <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
