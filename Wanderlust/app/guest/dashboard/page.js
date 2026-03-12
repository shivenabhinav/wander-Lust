// // app/guest/dashboard/page.js
// "use client";
// import WelcomeBanner from "./components/WelcomeBanner";
// import UpcomingTrips from "./components/UpcomingTrips";
// import PastTrips from "./components/PastTrips";
// import Wishlist from "./components/Wishlist";
// import Recommendations from "./components/Recommendations";
// import ProfileCard from "./components/ProfileCard";

// export default function GuestDashboard() {
//   const user = {
//     name: "Deepak",
//     email: "deepak@example.com",
//     avatar: "/images/avatar.png",
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <WelcomeBanner user={user} />
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="md:col-span-2 space-y-8">
//             <UpcomingTrips />
//             <PastTrips />
//             <Wishlist />
//             <Recommendations />
//           </div>
//           <div>
//             <ProfileCard user={user} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useEffect, useState } from "react";
// import WelcomeBanner from "./components/WelcomeBanner";
// import UpcomingTrips from "./components/UpcomingTrips";
// import PastTrips from "./components/PastTrips";
// import Wishlist from "./components/Wishlist";
// import Recommendations from "./components/Recommendations";
// import ProfileCard from "./components/ProfileCard";

// export default function GuestDashboard() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     const fetchUser = async () => {
//       const res = await fetch(`/api/users/${userId}`);
//       const data = await res.json();
//       setUser(data);
//     };

//     fetchUser();
//   }, []);

//   if (!user) return null; // or a loader if you want

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <WelcomeBanner user={user} />
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="md:col-span-2 space-y-8">
//             <UpcomingTrips />
//             <PastTrips />
//             <Wishlist />
//             <Recommendations />
//           </div>
//           <div>
//             <ProfileCard user={user} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import WelcomeBanner from "./components/WelcomeBanner";
import UpcomingTrips from "./components/UpcomingTrips";
import PastTrips from "./components/PastTrips";
import Wishlist from "./components/Wishlist";
import Recommendations from "./components/Recommendations";
import ProfileCard from "./components/ProfileCard";

export default function GuestDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchUser = async () => {
      // fetch user
      const userRes = await fetch(`/api/users/${userId}`);
      const userData = await userRes.json();
      setUser(userData);
    };

    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium">
            ← Back to Home
          </Link>
        </div>
        <WelcomeBanner user={user} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-8">
            <UpcomingTrips />
            <PastTrips />
            <Wishlist />
            <Recommendations />
          </div>
          <div>
            <ProfileCard user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
