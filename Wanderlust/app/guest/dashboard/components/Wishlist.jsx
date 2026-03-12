"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, X, ChevronRight } from "lucide-react";

export default function Wishlist() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist/${userId}`);
        const data = await res.json();
        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Saved Favorites</h2>
        <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-bold rounded-full border border-pink-100 dark:border-pink-800">
          {favorites.length} Saved
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No properties saved yet. Start exploring!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <Link href={`/properties/${fav._id}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={fav.images?.[0] || "/placeholder-property.jpg"}
                    alt={fav.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="p-2 bg-white/90 backdrop-blur rounded-full text-pink-500 shadow-lg">
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{fav.title}</h4>
                    <span className="text-blue-600 dark:text-blue-400 font-black">₹{fav.pricePerNight}</span>
                  </div>

                  <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-medium mb-4">
                    <MapPin className="w-3 h-3 text-pink-500" />
                    {fav.location?.city || "Discovery Place"}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">View Details</span>
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
