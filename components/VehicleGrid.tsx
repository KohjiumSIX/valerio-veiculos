"use client";

import Image from "next/image";
import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import type { Car } from "@/lib/data";

type VehicleGridProps = {
  vehicles: Car[];
};

const WHATSAPP_PHONE = "5547984629584";

function getVehicleImage(vehicle: Car) {
  if ("images" in vehicle && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
    return vehicle.images[0];
  }

  if ("image" in vehicle && typeof vehicle.image === "string" && vehicle.image.length > 0) {
    return vehicle.image;
  }

  return "/placeholder-car.jpg";
}

function getVehicleSlug(vehicle: Car) {
  if ("slug" in vehicle && typeof vehicle.slug === "string" && vehicle.slug.length > 0) {
    return vehicle.slug;
  }

  return "";
}

function getVehicleBadge(vehicle: Car) {
  if ("isOffer" in vehicle && vehicle.isOffer) return "Oferta";
  if ("isNew" in vehicle && vehicle.isNew) return "Recém-chegado";
  if ("featured" in vehicle && vehicle.featured) return "Destaque";
  return null;
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (!vehicles.length) {
    return (
      <div className="rounded-[1.75rem] border border-black/10 bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-black">
          Nenhum veículo encontrado
        </h3>
        <p className="mt-2 text-sm text-black/60">
          Tente ajustar os filtros para visualizar mais opções.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle, index) => {
        const image = getVehicleImage(vehicle);
        const slug = getVehicleSlug(vehicle);
        const badge = getVehicleBadge(vehicle);
        const whatsappLink = generateWhatsAppLink({
          phone: WHATSAPP_PHONE,
          vehicleName: vehicle.title,
        });

        return (
          <article
            key={slug || `${vehicle.title}-${index}`}
            className="group overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative">
              <Link
                href={slug ? `/veiculos/${slug}` : "#"}
                className="block"
                aria-label={`Ver detalhes de ${vehicle.title}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <Image
                    src={image}
                    alt={vehicle.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
              </Link>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

              {badge && (
                <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black shadow-sm">
                  {badge}
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">
                    {vehicle.subtitle}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-xl font-semibold text-white">
                    {vehicle.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-black/45">
                    Preço
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-black">
                    {vehicle.price}
                  </p>
                </div>

                <div className="rounded-2xl bg-black px-3 py-2 text-right text-white">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                    Ano
                  </p>
                  <p className="text-sm font-semibold">{vehicle.year}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">
                    KM
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {vehicle.km}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">
                    Câmbio
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {vehicle.transmission}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">
                    Combustível
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {vehicle.fuel}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">
                    Modelo
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm font-semibold text-black">
                    {vehicle.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={slug ? `/veiculos/${slug}` : "#"}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
                >
                  Ver detalhes
                </Link>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-100"
                >
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}