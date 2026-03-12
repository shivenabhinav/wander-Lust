"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "./SectionTitle";
import { useRouter } from "next/navigation";

export default function AllProperties() {
  const [properties, setProperties] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/explore/all")
      .then((res) => res.json())
      .then((data) => setProperties(data.properties || []));
  }, []);

  if (!properties.length) return null;

  return (
    <section>
      {/* Title Row with "See All" Button */}
      <div className="flex items-center justify-between mb-4">
        <SectionTitle title="All Stays" />

        <button
          onClick={() => router.push("/explore/all")}
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
        >
          See All
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* Grid – show ONLY 3 items */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.slice(0, 3).map((p) => (
          <Link
            key={p._id}
            href={`/properties/${p._id}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <Image
              src={p.images[0]}
              alt={p.title}
              width={400}
              height={250}
              className="h-48 w-full object-cover"
              unoptimized
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg dark:text-white">
                {p.title}
              </h3>
              <p className="text-gray-500">{p.location.address}</p>
              <p className="text-blue-600 font-bold mt-2">
                ₹{p.pricePerNight}/night
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
