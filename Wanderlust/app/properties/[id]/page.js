import ImageCarousel from "@/components/property/ImageCarousel";
import WishlistButton from "@/components/property/WishlistButton";
import BookingWidget from "@/components/property/BookingWidget";

export default async function PropertyPage({ params }) {
  const { id } = await params;

  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/properties/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="pt-24 text-center text-red-500">
        Property not found
      </div>
    );
  }

  const property = await res.json();

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 md:px-8">
      
      {/* IMAGE CAROUSEL */}
      <ImageCarousel images={property.images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          <h1 className="text-3xl font-bold dark:text-white">
            {property.title}
          </h1>

          <p className="text-gray-500 dark:text-gray-300">
            {property.location.address}
          </p>

          {/* Wishlist */}
          <WishlistButton propertyId={property._id} />

          <p className="text-gray-700 dark:text-gray-300">
            {property.description}
          </p>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold dark:text-white mb-2">
              Amenities
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOOKING WIDGET */}
        <BookingWidget property={property} />
      </div>
    </div>
  );
}


