"use client";

import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/lib/types";

type VehicleGridProps = {
  vehicles: Vehicle[];
};

function formatPrice(price: number | null) {
  if (typeof price !== "number") {
    return "Sob consulta";
  }

  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatKm(km: number | null) {
  if (typeof km !== "number") {
    return null;
  }

  return `${km.toLocaleString("pt-BR")} km`;
}

// 🔥 função segura que NÃO quebra URL válida
function getImageSrc(vehicle: Vehicle) {
  const src = vehicle.images?.[0] || vehicle.cover_image;

  if (!src || typeof src !== "string") {
    return "/placeholder-car.jpg";
  }

  const value = src.trim();

  if (!value) {
    return "/placeholder-car.jpg";
  }

  // 👉 se já for URL válida, usa direto (SEU CASO)
  if (value.startsWith("http")) {
    return value;
  }

  // 👉 se for imagem local
  if (value.startsWith("/")) {
    return value;
  }

  // 👉 fallback (caso venha algo estranho)
  return "/placeholder-car.jpg";
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (!vehicles.length) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 text-center text-black/60 shadow-sm">
        Nenhum veículo encontrado.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => {
        const imageSrc = getImageSrc(vehicle);

        return (
          <article
            key={vehicle.id}
            className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link href={`/veiculos/${vehicle.slug}`} className="block">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
                <Image
                  src={imageSrc}
                  alt={vehicle.title || "Veículo"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {vehicle.is_offer && (
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                      Oferta
                    </span>
                  )}

                  {vehicle.is_new_arrival && (
                    <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                      Recém-chegado
                    </span>
                  )}

                  {vehicle.is_featured && (
                    <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black">
                      Destaque
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      {vehicle.title}
                    </h3>

                    <p className="mt-1 text-sm text-black/55">
                      {vehicle.brand} • {vehicle.model}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-black/55">
                  {vehicle.year && (
                    <span className="rounded-full bg-black/5 px-3 py-1">
                      {vehicle.year}
                    </span>
                  )}

                  {formatKm(vehicle.km) && (
                    <span className="rounded-full bg-black/5 px-3 py-1">
                      {formatKm(vehicle.km)}
                    </span>
                  )}

                  {vehicle.fuel && (
                    <span className="rounded-full bg-black/5 px-3 py-1">
                      {vehicle.fuel}
                    </span>
                  )}

                  {vehicle.transmission && (
                    <span className="rounded-full bg-black/5 px-3 py-1">
                      {vehicle.transmission}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-xl font-bold text-black">
                    {formatPrice(vehicle.price)}
                  </p>

                  <span className="text-sm font-medium text-black/55 transition group-hover:text-black">
                    Ver detalhes
                  </span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}