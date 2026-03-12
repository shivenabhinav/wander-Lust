"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0);

  const next = () =>
    setIndex((i) => (i + 1) % images.length);

  const prev = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-lg">
      <Image
        src={images[index]}
        alt="Property Image"
        fill
        className="object-cover"
        unoptimized
      />

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
      >
        ◀
      </button>

      <button
        onClick={next}
        className="absolute right-3 top-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
      >
        ▶
      </button>
    </div>
  );
}
