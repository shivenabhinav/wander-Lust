"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SearchX } from "lucide-react"; // for "no results" icon
import { motion } from "framer-motion";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/properties/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setProperties(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  }, [query]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600 dark:text-gray-300">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mb-4"></div>
        <p>Loading properties...</p>
      </div>
    );

  if (!properties.length)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600 dark:text-gray-300">
        <SearchX size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold">No Results Found</h2>
        <p className="text-gray-500 mt-2">
          We couldn’t find any properties for “{query}”. Try another search.
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <motion.div
          key={property._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <Image
            src={property.images?.[0] || "/placeholder.webp"}
            alt={property.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {property.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1">
              {property.description}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-blue-600 font-bold text-sm">
                ₹{property.pricePerNight}/night
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                ⭐ {property.ratingsAvg || "New"}
              </span>
            </div>

            {property.amenities?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.slice(0, 3).map((amenity, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-1 rounded-md"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
