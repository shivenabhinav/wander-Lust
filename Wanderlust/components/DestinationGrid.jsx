"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DestinationGrid() {
  const router = useRouter();

  const destinations = [
    { name: "Goa", image: "/Goa.webp" },
    { name: "Manali", image: "/Manali.webp" },
    { name: "Jaipur", image: "/Jaipur.webp" },
    { name: "Ooty", image: "/Ooty.webp" },
  ];

  return (
    <section className="my-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Explore Popular Destinations
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {destinations.map((d) => (
          <div
            key={d.name}
            onClick={() =>
              router.push(`/explore/destination/${d.name.toLowerCase()}`)
            }
            className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative w-full h-44">
              <Image
                src={d.image}
                alt={d.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>

            <div className="absolute bottom-3 left-3 text-white font-semibold text-lg drop-shadow-lg">
              {d.name}
            </div>

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
