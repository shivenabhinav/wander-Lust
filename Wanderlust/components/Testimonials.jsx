export default function Testimonials() {
  const reviews = [
    { name: "Ananya", text: "The villa was beautiful! Booking was so easy.", avatar: "/Ananya.webp" },
    { name: "Rohit", text: "Loved the experience. Highly recommend Wanderlust!", avatar: "/Rohit.webp" },
    { name: "Sneha", text: "Great service and amazing hosts!", avatar: "/Sneha.webp" },
  ];

  return (
    <section className="my-16 text-center">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
        What Our Guests Say
      </h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <img
              src={r.avatar}
              alt={r.name}
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
            />
            <p className="italic text-gray-600 dark:text-gray-300 mb-2">“{r.text}”</p>
            <h4 className="font-semibold text-gray-800 dark:text-white">{r.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
