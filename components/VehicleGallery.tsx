"use client";

import { useState, useEffect } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function VehicleGallery({ images, title }: Props) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  function next() {
    setSelected((prev) => (prev + 1) % images.length);
  }

  function prev() {
    setSelected((prev) => (prev - 1 + images.length) % images.length);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return;

      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!images.length) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-[1.5rem] bg-black/5 text-sm text-black/40">
        Sem imagem
      </div>
    );
  }

  return (
    <>
      {/* IMAGEM PRINCIPAL */}
      <div className="space-y-4">
        <div
          onClick={() => setOpen(true)}
          className="group cursor-zoom-in overflow-hidden rounded-[2rem] border border-black/10 bg-black"
        >
          <img
            src={images[selected]}
            alt={title}
            className="h-[320px] w-full object-cover transition duration-300 group-hover:scale-[1.05] sm:h-[420px] lg:h-[560px]"
          />
        </div>

        {/* THUMBS */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`overflow-hidden rounded-2xl border ${
                  i === selected
                    ? "border-black shadow-sm"
                    : "border-black/10 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${title} ${i}`}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FULLSCREEN */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[95vw] max-h-[90vh]"
          >
            <img
              src={images[selected]}
              className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl"
            />

            {/* BOTÃO FECHAR */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 rounded-full bg-white/10 px-3 py-1 text-white text-sm hover:bg-white/20"
            >
              ✕
            </button>

            {/* SETAS */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                >
                  ←
                </button>

                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}