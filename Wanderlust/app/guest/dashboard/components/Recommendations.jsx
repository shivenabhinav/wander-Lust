// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// export default function Recommendations() {
//   const [recommendations, setRecommendations] = useState([]);
//   const [showAll, setShowAll] = useState(false);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     const fetchRecommendations = async () => {
//       try {
//         const res = await fetch(`/api/recommendations/${userId}`);
//         const data = await res.json();
//         setRecommendations(data || []);
//       } catch (err) {
//         console.error("Failed to load recommendations", err);
//       }
//     };

//     fetchRecommendations();
//   }, []);

//   // 👉 show only 3 initially, all when "See All" is clicked
//   const visibleRecommendations = showAll
//     ? recommendations
//     : recommendations.slice(0, 3);

//   return (
//     <section>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//           Recommended for You
//         </h3>

//         {recommendations.length > 3 && !showAll && (
//           <button
//             onClick={() => setShowAll(true)}
//             className="text-sm text-blue-600 hover:underline font-medium"
//           >
//             See all
//           </button>
//         )}
//       </div>

//       {recommendations.length === 0 ? (
//         <p className="text-gray-500">No recommendations available right now.</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecommendations.map((r) => (
//             <div
//               key={r._id}
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
//             >
//               <Image
//                 src={r.images?.[0] || "/property-placeholder.jpg"}
//                 alt={r.title}
//                 width={400}
//                 height={250}
//                 className="w-full h-40 object-cover"
//               />
//               <div className="p-4">
//                 <h4 className="font-bold text-lg">{r.title}</h4>
//                 <p className="text-gray-500">{r.location?.city}</p>
//                 <p className="text-blue-600 font-medium mt-2">
//                   ₹{r.pricePerNight}/night
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`/api/recommendations/${userId}`);
        const data = await res.json();
        setRecommendations(data || []);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      }
    };

    fetchRecommendations();
  }, []);

  const visibleRecommendations = showAll
    ? recommendations
    : recommendations.slice(0, 3);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Recommended for You
        </h3>

        {recommendations.length > 3 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            {showAll ? "Show less" : "See all"}
          </button>
        )}
      </div>

      {recommendations.length === 0 ? (
        <p className="text-gray-500">No recommendations available right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRecommendations.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              <Link href={`/properties/${r._id}`}>
                <div className="relative">
                  <Image
                    src={r.images?.[0] || "/property-placeholder.jpg"}
                    alt={r.title}
                    width={400}
                    height={250}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg">{r.title}</h4>
                  <p className="text-gray-500">{r.location?.city}</p>
                  <p className="text-blue-600 font-medium mt-2">
                    ₹{r.pricePerNight}/night
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
