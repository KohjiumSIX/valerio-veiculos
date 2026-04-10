import type { Car } from "@/lib/data";
import type { Vehicle } from "@/lib/types";
import { formatKm, formatPrice } from "@/lib/utils";

export function mapVehicleToCard(vehicle: Vehicle): Car {
  return {
    id: Number(vehicle.id.replace(/\D/g, "").slice(0, 12) || "0"),
    slug: vehicle.slug,
    title: vehicle.title,
    subtitle: `${vehicle.brand} • ${vehicle.model}`,
    price: formatPrice(Number(vehicle.price)),
    image:
      vehicle.cover_image ||
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    year: vehicle.year,
    km: formatKm(vehicle.km),
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    badge: vehicle.is_offer
      ? "Oferta"
      : vehicle.is_new_arrival
        ? "Recém-chegado"
        : vehicle.is_featured
          ? "Destaque"
          : undefined,
  };
}