import type { Vehicle } from "@/lib/types";
import type { Car } from "@/lib/data";

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
    return "0 km";
  }

  return `${km.toLocaleString("pt-BR")} km`;
}

export function mapVehicleToCard(vehicle: Vehicle): Car {
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    title: vehicle.title,
    subtitle: `${vehicle.brand} • ${vehicle.model}`,
    price: formatPrice(vehicle.price),
    image:
      vehicle.cover_image ||
      vehicle.images?.[0] ||
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    year: vehicle.year ?? 0,
    km: formatKm(vehicle.km),
    fuel: vehicle.fuel ?? "-",
    transmission: vehicle.transmission ?? "-",
    badge: vehicle.is_offer
      ? "Oferta"
      : vehicle.is_new_arrival
      ? "Recém-chegado"
      : vehicle.is_featured
      ? "Destaque"
      : undefined,
  };
}