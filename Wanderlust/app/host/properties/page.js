// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function MyProperties() {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hostId, setHostId] = useState(null);

//   // ✅ Step 1: Read from localStorage only on client
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const id = localStorage.getItem("userId");
//       setHostId(id);
//     }
//   }, []);

//   // ✅ Step 2: Fetch properties only after we have hostId
//   useEffect(() => {
//     if (!hostId) return;

//     const fetchProperties = async () => {
//       try {
//         const res = await fetch(`/api/properties?hostId=${hostId}`);
//         if (!res.ok) throw new Error("Failed to fetch properties");
//         const data = await res.json();
//         setProperties(data.properties || []);
//       } catch (err) {
//         console.error("Error fetching properties:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, [hostId]);

//   // ✅ Step 3: Handle loading and empty states
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-gray-500">Loading properties...</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//           My Properties
//         </h1>
//         <Link
//           href="/host/add-property"
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           + Add New
//         </Link>
//       </div>

//       {properties.length === 0 ? (
//         <p className="text-gray-500">
//           No properties found. Add one to get started!
//         </p>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {properties.map((p) => (
//             <div
//               key={p._id}
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
//             >
//               <Image
//                 src={p.images?.[0] || "/default-house.jpg"}
//                 alt={p.title}
//                 width={400}
//                 height={250}
//                 className="w-full h-48 object-cover"
//                 unoptimized
//               />

//               <div className="p-4">
//                 <h2 className="font-bold text-lg text-gray-900 dark:text-white">
//                   {p.title}
//                 </h2>
//                 <p className="text-gray-500">
//                   {p.location?.address || "Unknown Location"}
//                 </p>
//                 <p className="mt-2 text-blue-600 font-semibold">
//                   ₹{p.pricePerNight}/night
//                 </p>

//                 <div className="flex gap-2 mt-3">
//                   <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
//                     Edit
//                   </button>
//                   <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hostId, setHostId] = useState(null);

  const router = useRouter();

  // Load hostId
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setHostId(id);
  }, []);

  // Fetch properties
  useEffect(() => {
    if (!hostId) return;

    const fetchProperties = async () => {
      try {
        const res = await fetch(`/api/properties?hostId=${hostId}`);
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [hostId]);

  // ✅ Step-1 Edit Handler
  const handleEdit = (property) => {
    // Store property in localStorage
    localStorage.setItem("editProperty", JSON.stringify(property));

    // Navigate to add-property page (edit mode)
    router.push(`/host/add-property?edit=true`);
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Properties
        </h1>
        <Link
          href="/host/add-property"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add New
        </Link>
      </div>

      {/* Property Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div
            key={p._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <Image
              src={p.images?.[0] || "/default-house.jpg"}
              alt={p.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
              unoptimized
            />

            <div className="p-4">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                {p.title}
              </h2>

              <p className="text-gray-500">{p.location?.address}</p>
              <p className="mt-2 text-blue-600 font-semibold">
                ₹{p.pricePerNight}/night
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit
                </button>

                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
