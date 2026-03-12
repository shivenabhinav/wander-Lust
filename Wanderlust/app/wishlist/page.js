"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`/api/wishlist/${userId}`)
      .then((res) => res.json())
      .then((data) => setWishlist(data.properties || []));
  }, []);

  return (
    <div className="pt-28 max-w-7xl mx-auto px-4 md:px-8">
      <h1 className="text-3xl font-bold dark:text-white mb-8">
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((p) => (
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

                <p className="text-gray-500">
                  {p.location.address}
                </p>

                <p className="text-blue-600 font-bold mt-2">
                  ₹{p.pricePerNight}/night
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
