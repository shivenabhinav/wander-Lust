"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import confetti from "canvas-confetti";

export default function WishlistButton({ propertyId }) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check initial wishlist status
  useEffect(() => {
    const userId = localStorage.getItem("userId") || session?.user?.id;
    if (userId && propertyId) {
      fetch(`/api/wishlist/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          const isIncluded = Array.isArray(data) && data.some((p) => p._id === propertyId);
          setIsWishlisted(isIncluded);
        })
        .catch((err) => console.error("Wishlist check error:", err));
    }
  }, [session, propertyId]);

  const toggleWishlist = async () => {
    const userId = localStorage.getItem("userId") || session?.user?.id;
    if (!userId) return alert("Please login to save properties");

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, propertyId }),
      });

      const data = await res.json();
      if (data.success) {
        setIsWishlisted(data.action === "added");
        if (data.action === "added") {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 },
            colors: ["#ff0000", "#ff69b4", "#ff1493"],
          });
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`group flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 shadow-sm border-2 ${isWishlisted
        ? "bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100"
        : "bg-white border-gray-100 text-gray-500 hover:border-pink-200 hover:text-pink-500"
        }`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-300 ${isWishlisted ? "fill-current scale-110" : "group-hover:scale-110"
          }`}
      />
      {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
    </button>
  );
}
