"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ImageGalleryProps = {
  images: string[];
  alt: string;
};

type Point = {
  x: number;
  y: number;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80";

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const gallery = useMemo(() => {
    const validImages = images.filter(Boolean);
    return validImages.length > 0 ? validImages : [FALLBACK_IMAGE];
  }, [images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const modalViewportRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragStartRef = useRef<Point>({ x: 0, y: 0 });
  const dragOffsetStartRef = useRef<Point>({ x: 0, y: 0 });
  const touchStartRef = useRef<Point | null>(null);
  const touchCurrentRef = useRef<Point | null>(null);
  const pinchDistanceRef = useRef<number | null>(null);

  function clampOffset(nextOffset: Point, scale: number) {
    const viewport = modalViewportRef.current;
    if (!viewport || scale <= 1) {
      return { x: 0, y: 0 };
    }

    const rect = viewport.getBoundingClientRect();
    const maxX = ((rect.width * scale) - rect.width) / 2;
    const maxY = ((rect.height * scale) - rect.height) / 2;

    return {
      x: Math.max(-maxX, Math.min(maxX, nextOffset.x)),
      y: Math.max(-maxY, Math.min(maxY, nextOffset.y)),
    };
  }

  function goTo(index: number) {
    if (gallery.length === 0) return;

    if (index < 0) {
      setCurrentIndex(gallery.length - 1);
    } else if (index >= gallery.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }

    setZoomScale(1);
    setOffset({ x: 0, y: 0 });
  }

  function openZoom() {
    setIsZoomOpen(true);
    setZoomScale(1);
    setOffset({ x: 0, y: 0 });
  }

  function closeZoom() {
    setIsZoomOpen(false);
    setZoomScale(1);
    setOffset({ x: 0, y: 0 });
    setDragging(false);
  }

  function applyZoom(nextScale: number) {
    const clampedScale = Math.max(1, Math.min(4, nextScale));
    setZoomScale(clampedScale);
    setOffset((prev) => clampOffset(prev, clampedScale));
  }

  function zoomIn() {
    applyZoom(zoomScale + 0.5);
  }

  function zoomOut() {
    applyZoom(zoomScale - 0.5);
  }

  function toggleDoubleClickZoom() {
    if (zoomScale > 1) {
      setZoomScale(1);
      setOffset({ x: 0, y: 0 });
      return;
    }

    setZoomScale(2);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isZoomOpen) return;

      if (event.key === "Escape") closeZoom();
      if (event.key === "ArrowRight") goTo(currentIndex + 1);
      if (event.key === "ArrowLeft") goTo(currentIndex - 1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, currentIndex, gallery.length]);

  useEffect(() => {
    if (!isZoomOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isZoomOpen]);

  return (
    <>
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-black">
          <button
            type="button"
            onClick={openZoom}
            className="group relative block w-full"
          >
            <img
              src={gallery[currentIndex]}
              alt={`${alt} ${currentIndex + 1}`}
              className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

            <span className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow">
              Clique para ampliar
            </span>
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(currentIndex - 1)}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-bold text-black shadow transition hover:bg-white"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => goTo(currentIndex + 1)}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-bold text-black shadow transition hover:bg-white"
              >
                →
              </button>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => goTo(index)}
                className={`overflow-hidden rounded-2xl border transition ${
                  index === currentIndex
                    ? "border-black bg-black p-0.5"
                    : "border-black/10 bg-white"
                }`}
              >
                <img
                  src={image}
                  alt={`${alt} miniatura ${index + 1}`}
                  className="h-24 w-full rounded-[0.9rem] object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={closeZoom}
        >
          <div
            className="relative flex h-full w-full max-w-7xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 pb-4 text-white">
              <div>
                <p className="text-sm text-white/60">Galeria do veículo</p>
                <p className="text-base font-semibold">
                  Imagem {currentIndex + 1} de {gallery.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  −
                </button>

                <button
                  type="button"
                  onClick={zoomIn}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={closeZoom}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div
              ref={modalViewportRef}
              className="relative flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-black"
              onWheel={(event) => {
                event.preventDefault();
                const delta = event.deltaY > 0 ? -0.25 : 0.25;
                applyZoom(zoomScale + delta);
              }}
              onTouchStart={(event) => {
                if (event.touches.length === 2) {
                  const dx = event.touches[0].clientX - event.touches[1].clientX;
                  const dy = event.touches[0].clientY - event.touches[1].clientY;
                  pinchDistanceRef.current = Math.hypot(dx, dy);
                  return;
                }

                if (event.touches.length === 1) {
                  const touch = event.touches[0];
                  touchStartRef.current = { x: touch.clientX, y: touch.clientY };
                  touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
                }
              }}
              onTouchMove={(event) => {
                if (event.touches.length === 2) {
                  const dx = event.touches[0].clientX - event.touches[1].clientX;
                  const dy = event.touches[0].clientY - event.touches[1].clientY;
                  const distance = Math.hypot(dx, dy);

                  if (pinchDistanceRef.current) {
                    const difference = distance - pinchDistanceRef.current;
                    if (Math.abs(difference) > 4) {
                      applyZoom(zoomScale + difference * 0.005);
                      pinchDistanceRef.current = distance;
                    }
                  }

                  return;
                }

                if (event.touches.length === 1) {
                  const touch = event.touches[0];
                  touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };

                  if (zoomScale > 1 && touchStartRef.current) {
                    const dx = touch.clientX - touchStartRef.current.x;
                    const dy = touch.clientY - touchStartRef.current.y;

                    setOffset((prev) =>
                      clampOffset(
                        {
                          x: prev.x + dx * 0.6,
                          y: prev.y + dy * 0.6,
                        },
                        zoomScale
                      )
                    );

                    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
                  }
                }
              }}
              onTouchEnd={() => {
                if (zoomScale === 1 && touchStartRef.current && touchCurrentRef.current) {
                  const dx = touchCurrentRef.current.x - touchStartRef.current.x;
                  if (Math.abs(dx) > 50) {
                    if (dx < 0) goTo(currentIndex + 1);
                    if (dx > 0) goTo(currentIndex - 1);
                  }
                }

                touchStartRef.current = null;
                touchCurrentRef.current = null;
                pinchDistanceRef.current = null;
              }}
            >
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(currentIndex - 1)}
                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-sm font-bold text-black shadow transition hover:bg-white"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() => goTo(currentIndex + 1)}
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-sm font-bold text-black shadow transition hover:bg-white"
                  >
                    →
                  </button>
                </>
              )}

              <div
                className={`flex h-full w-full items-center justify-center overflow-hidden ${
                  zoomScale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                }`}
                onMouseDown={(event) => {
                  if (zoomScale <= 1) return;
                  setDragging(true);
                  dragStartRef.current = { x: event.clientX, y: event.clientY };
                  dragOffsetStartRef.current = offset;
                }}
                onMouseMove={(event) => {
                  if (!dragging || zoomScale <= 1) return;

                  const dx = event.clientX - dragStartRef.current.x;
                  const dy = event.clientY - dragStartRef.current.y;

                  setOffset(
                    clampOffset(
                      {
                        x: dragOffsetStartRef.current.x + dx,
                        y: dragOffsetStartRef.current.y + dy,
                      },
                      zoomScale
                    )
                  );
                }}
                onMouseUp={() => setDragging(false)}
                onMouseLeave={() => setDragging(false)}
                onDoubleClick={toggleDoubleClickZoom}
              >
                <img
                  ref={imageRef}
                  src={gallery[currentIndex]}
                  alt={`${alt} ampliada ${currentIndex + 1}`}
                  className="max-h-full max-w-full select-none object-contain transition-transform duration-200"
                  draggable={false}
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoomScale})`,
                  }}
                />
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-zoom-${index}`}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`overflow-hidden rounded-2xl border transition ${
                      index === currentIndex
                        ? "border-white bg-white/10 p-0.5"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${alt} miniatura ampliada ${index + 1}`}
                      className="h-20 w-full rounded-[0.9rem] object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}