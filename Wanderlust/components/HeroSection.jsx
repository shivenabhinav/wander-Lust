"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const goToExplore = () => {
    router.push("/explore");
  };

  return (
    <section className="my-17 relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/glenn-carstens-peters-ZWD3Dx6aUJg-unsplash.jpg"
          alt="Travel background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-75"
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          Discover Your Next Gateway 🌴
        </motion.h1>

        <p className="text-base sm:text-lg mb-8 text-gray-200 max-w-xl mx-auto">
          Find unique stays and unforgettable experiences around the world.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={goToExplore}
            className="bg-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Explore Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
