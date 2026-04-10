"use client";

import { useEffect, useState } from "react";

const images = [
  "/images/loja.jpg",
  "/images/loja2.jpg",
  "/images/loja3.jpg",
  "/images/loja4.jpg",
  "/images/loja5.jpg"
];

export default function HeroGallery() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[300px] overflow-hidden rounded-[2rem] border border-white/10 sm:h-[420px] lg:h-[560px]">
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt={`Loja Valério Veículos ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="inline-block rounded-full bg-black/60 px-4 py-2 text-xs text-white/80 backdrop-blur">
          📍 Rua Camarista Carlos Schneider, N°3359, Rio Negro, Parana, Brazil 83883252
        </div>
      </div>
    </div>
  );
}