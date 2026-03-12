"use client";

import Image from "next/image";
import Link from "next/link";

export default function PropertiesList({ data }) {
  if (!data?.length)
    return <p className="text-gray-500">No properties found.</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((p) => (
        <Link
          key={p._id}
          href={`/properties/${p._id}`}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <div className="relative h-48 w-full">
            <Image
              src={p.images?.[0]}
              alt={p.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg dark:text-white line-clamp-1">
              {p.title}
            </h3>

            <p className="text-gray-500">{p.location?.address}</p>

            <p className="text-blue-600 font-bold mt-2">
              ₹{p.pricePerNight}/night
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
