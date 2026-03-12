
"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

export default function PropertyCard({ property }) {
  const {
    _id,
    title,
    images,
    pricePerNight,
    location,
    propertyType,
    ratingsAvg,
  } = property;

  return (
    <Link
      href={`/property/${_id}`}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md 
      hover:shadow-lg transition overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Image */}
      <div className="relative w-full h-56">
        <Image
          src={images?.[0] || "/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
          <MapPin size={14} className="mr-1" />
          {location?.address}
        </div>

        {/* Property Type + Rating */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 
          dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
            {propertyType}
          </span>

          <div className="flex items-center text-yellow-500">
            <Star size={14} />
            <span className="ml-1 text-sm text-gray-800 dark:text-gray-300">
              {ratingsAvg || 0}
            </span>
          </div>
        </div>

        {/* Price */}
        <p className="text-base font-semibold text-gray-900 dark:text-white mt-2">
          ₹{pricePerNight}
          <span className="text-sm text-gray-500 dark:text-gray-400"> / night</span>
        </p>

      </div>
    </Link>
  );
}
