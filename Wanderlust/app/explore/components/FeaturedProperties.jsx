// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import SectionTitle from "./SectionTitle";

// export default function FeaturedProperties() {
//   const [featured, setFeatured] = useState([]);

//   useEffect(() => {
//     fetch("/api/explore/featured") // ✅ FIXED ROUTE
//       .then((res) => res.json())
//       .then((data) => setFeatured(data.featured || []));
//   }, []);

//   if (!featured.length) return null;

//   return (
//     <section>
//       <SectionTitle title="Featured Stays ✨" />

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {featured.map((p) => (
//           <Link
//             key={p._id}
//             href={`/property/${p._id}`}
//             className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
//           >
//             {/* Image Section */}
//             <div className="relative h-56 w-full">
//               <Image
//                 src={p.images?.[0]}
//                 alt={p.title}
//                 fill
//                 className="object-cover group-hover:scale-105 transition duration-300"
//                 unoptimized
//               />

//               {/* Gradient overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>

//               {/* Featured Badge */}
//               <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
//                 ✨ Featured
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-4 bg-white dark:bg-gray-800">
//               <h3 className="font-semibold text-lg dark:text-white line-clamp-1">
//                 {p.title}
//               </h3>

//               <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-1">
//                 {p.location?.address}
//               </p>

//               <p className="text-blue-600 font-bold mt-3 text-lg">
//                 ₹{p.pricePerNight}/night
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "./SectionTitle";
import { useRouter } from "next/navigation";

export default function FeaturedProperties() {
  const [featured, setFeatured] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/explore/featured")
      .then((res) => res.json())
      .then((data) => setFeatured(data.featured || []));
  }, []);

  if (!featured.length) return null;

  return (
    <section>
      {/* Title Row with "See All" */}
      <div className="flex items-center justify-between mb-4">
        <SectionTitle title="Featured Stays ✨" />

        <button
          onClick={() => router.push("/explore/featured")}
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
        >
          See All
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* Property Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.slice(0, 3).map((p) => (
          <Link
            key={p._id}
            href={`/properties/${p._id}`}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-56 w-full">
              <Image
                src={p.images?.[0]}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>

              <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                ✨ Featured
              </div>
            </div>

            {/* Content */}
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-lg dark:text-white line-clamp-1">
                {p.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-1">
                {p.location?.address}
              </p>

              <p className="text-blue-600 font-bold mt-3 text-lg">
                ₹{p.pricePerNight}/night
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
