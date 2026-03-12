export default async function BookingPage({ params }) {
  const { id } = await params;

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/bookings/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="pt-28 text-center text-red-500">
        Booking not found
      </div>
    );
  }

  const booking = await res.json();
  const p = booking.property;

  return (
    <div className="pt-28 max-w-4xl mx-auto px-4 md:px-8">
      <h1 className="text-3xl font-bold dark:text-white mb-6">
        🧾 Booking Confirmation
      </h1>

      {/* Property card style */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        
        {/* Image */}
        <div className="relative h-64 w-full">
          <img
            src={p.images[0]}
            alt={p.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold dark:text-white">
            {p.title}
          </h2>

          <p className="text-gray-500 dark:text-gray-300">
            {p.location.address}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-300">Check-in</p>
              <p className="font-semibold dark:text-white">
                {new Date(booking.checkIn).toDateString()}
              </p>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-300">Check-out</p>
              <p className="font-semibold dark:text-white">
                {new Date(booking.checkOut).toDateString()}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-blue-700 dark:text-blue-300 font-medium">
              Total Price:
            </p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-400">
              ₹{booking.totalPrice}
            </p>
          </div>

          <p className="text-green-600 dark:text-green-400 font-semibold">
            Status: {booking.paymentStatus}
          </p>
        </div>
      </div>
    </div>
  );
}
