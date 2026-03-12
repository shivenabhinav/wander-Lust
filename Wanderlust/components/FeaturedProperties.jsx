// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";

// export default function FeaturedProperties() {
//   const [properties, setProperties] = useState([]);

//   useEffect(() => {
//     const fetchFeatured = async () => {
//       try {
//         const res = await fetch("/api/properties/featured");
//         const data = await res.json();
//         setProperties(data || []);
//       } catch (err) {
//         console.error("Failed to load featured properties", err);
//       }
//     };

//     fetchFeatured();
//   }, []);

//   return (
//     <section className="my-12 px-4">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
//         Featured Properties
//       </h2>

//       {/* 🔄 Horizontal scroll container */}
//       <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
//         {properties.map((p) => (
//           <div
//             key={p._id}
//             className="min-w-[320px] max-w-[320px]
//               bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
//               shadow-md hover:shadow-2xl hover:scale-[1.02]
//               transition-all duration-300"
//           >
//             <div className="relative w-full h-56">
//               <Image
//                 src={p.images?.[0] || "/property-placeholder.jpg"}
//                 alt={p.title}
//                 fill
//                 sizes="320px"
//                 className="object-cover"
//                 priority
//               />
//             </div>

//             <div className="p-4">
//               <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
//                 {p.title}
//               </h3>
//               <p className="text-gray-500 text-sm">
//                 {p.location?.city}
//               </p>

//               <div className="flex justify-between items-center mt-3">
//                 <span className="text-blue-600 font-semibold">
//                   ₹{p.pricePerNight.toLocaleString()}/night
//                 </span>
//                 <span className="text-yellow-500 font-medium flex items-center gap-1">
//                   ⭐ {p.ratingsAvg || "New"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/properties/featured");
        const data = await res.json();
        setProperties(data || []);
      } catch (err) {
        console.error("Failed to load featured properties", err);
      }
    };

    fetchFeatured();
  }, []);

  const handleNavigate = (id) => {
    router.push(`/properties/${id}`);
  };

  return (
    <section className="my-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Featured Properties
      </h2>

      {/* 🔄 Horizontal scroll container */}
      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
        {properties.map((p) => (
          <div
            key={p._id}
            onClick={() => handleNavigate(p._id)}
            className="min-w-[320px] max-w-[320px]
              bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
              shadow-md hover:shadow-2xl hover:scale-[1.02]
              transition-all duration-300 cursor-pointer"
          >
            <div className="relative w-full h-56">
              <Image
                src={p.images?.[0] || "/property-placeholder.jpg"}
                alt={p.title}
                fill
                sizes="320px"
                className="object-cover pointer-events-none"
                priority
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {p.title}
              </h3>
              <p className="text-gray-500 text-sm">
                {p.location?.city}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-blue-600 font-semibold">
                  ₹{p.pricePerNight.toLocaleString()}/night
                </span>
                <span className="text-yellow-500 font-medium flex items-center gap-1">
                  ⭐ {p.ratingsAvg || "New"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
