import Image from "next/image";
import SectionTitle from "./SectionTitle";

const destinations = [
  { name: "Goa", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  { name: "Manali", image: "https://images.unsplash.com/photo-1583241801219-3fec9efb4d12" },
  { name: "Ooty", image: "https://images.unsplash.com/photo-1536104968055-4d61aa56f46a" },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1501889088093-90b27410c6f6" },
];

export default function TopDestinations() {
  return (
    <section>
      <SectionTitle title="Top Destinations 🌍" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {destinations.map((d) => (
          <div
            key={d.name}
            className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer"
          >
            <Image
              src={`${d.image}?auto=format&q=80`}
              alt={d.name}
              width={300}
              height={200}
              className="h-40 w-full object-cover group-hover:scale-105 transition"
              unoptimized
            />

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{d.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
