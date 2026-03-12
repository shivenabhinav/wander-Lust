// "use client";

// import { useRouter } from "next/navigation";
// import SectionTitle from "./SectionTitle";

// const categories = [
//   { name: "Beach", icon: "🏖️" },
//   { name: "Mountain", icon: "⛰️" },
//   { name: "Villa", icon: "🏡" },
//   { name: "Hotel", icon: "🏨" },
//   { name: "City Stay", icon: "🏙️" },
//   { name: "Luxury", icon: "💎" },
//   { name: "Budget", icon: "💸" },
//   { name: "Trending", icon: "🔥" },
// ];

// export default function Categories() {
//   const router = useRouter();

//   return (
//     <section>
//       <SectionTitle title="Explore by Category" />

//       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
//         {categories.map((cat) => (
//           <div
//             key={cat.name}
//             onClick={() =>
//               router.push(`/explore/category/${cat.name.toLowerCase()}`)
//             }
//             className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 
//             flex flex-col items-center hover:shadow-lg cursor-pointer transition"
//           >
//             <span className="text-3xl">{cat.icon}</span>
//             <span className="mt-2 text-gray-700 dark:text-gray-200 font-medium">
//               {cat.name}
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import SectionTitle from "./SectionTitle";

// const categories = [
//   { name: "Beach", icon: "🏖️" },
//   { name: "Mountain", icon: "⛰️" },
//   { name: "Villa", icon: "🏡" },
//   { name: "Hotel", icon: "🏨" },
//   { name: "City Stay", icon: "🏙️" },
//   { name: "Luxury", icon: "💎" },
//   { name: "Budget", icon: "💸" },
//   { name: "Trending", icon: "🔥" },
// ];

// export default function Categories() {
//   const router = useRouter();

//   return (
//     <section>
//       <SectionTitle title="Explore by Category" />

//       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
//         {categories.map((cat) => (
//           <div
//             key={cat.name}
//             onClick={() =>
//               router.push(`/explore/category/${cat.name.toLowerCase()}`)
//             }
//             className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 
//             flex flex-col items-center hover:shadow-lg cursor-pointer transition"
//           >
//             <span className="text-3xl">{cat.icon}</span>
//             <span className="mt-2 text-gray-700 dark:text-gray-200 font-medium">
//               {cat.name}
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import SectionTitle from "./SectionTitle";

const categories = [
  { name: "Beach", icon: "🏖️" },
  { name: "Mountain", icon: "⛰️" },
  { name: "Villa", icon: "🏡" },
  { name: "Hotel", icon: "🏨" },
  { name: "City Stay", icon: "🏙️" },
  { name: "Luxury", icon: "💎" },
  { name: "Budget", icon: "💸" },
  { name: "Trending", icon: "🔥" },
];

export default function Categories() {
  const router = useRouter();

  const goToCategory = (name) => {
    const key = name.toLowerCase();

    if (["beach", "mountain", "city stay", "luxury"].includes(key)) {
      router.push(`/explore/category/${key}`);
    } else if (["villa", "hotel"].includes(key)) {
      router.push(`/explore/property-type/${key}`);
    } else if (["budget", "trending"].includes(key)) {
      router.push(`/explore/filters/${key}`);
    }
  };

  return (
    <section>
      <SectionTitle title="Explore by Category" />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => goToCategory(cat.name)}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 
            flex flex-col items-center hover:shadow-lg cursor-pointer transition"
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="mt-2 text-gray-700 dark:text-gray-200 font-medium">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
