const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "") || "";

function buildSupabasePublicUrl(path: string) {
  if (!SUPABASE_URL) return "/placeholder-car.jpg";

  const clean = path.replace(/^\/+/, "").replace(/^public\//, "");
  return `${SUPABASE_URL}/storage/v1/object/public/${clean}`;
}

function isAbsoluteUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function looksLikeStoragePath(value: string) {
  return (
    value.startsWith("vehicles/") ||
    value.startsWith("vehicle-images/") ||
    value.startsWith("uploads/") ||
    value.startsWith("public/vehicles/") ||
    value.startsWith("public/vehicle-images/") ||
    /\.(png|jpg|jpeg|webp|avif)$/i.test(value)
  );
}

export function normalizeImagesField(images: unknown): string[] {
  if (Array.isArray(images)) {
    return images.filter((item): item is string => typeof item === "string");
  }

  if (typeof images === "string") {
    const trimmed = images.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return trimmed
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [trimmed];
  }

  return [];
}

export function getSafeImageSrc(input?: string | null): string {
  if (!input || typeof input !== "string") {
    return "/placeholder-car.jpg";
  }

  const value = input.trim();

  if (!value) {
    return "/placeholder-car.jpg";
  }

  if (isAbsoluteUrl(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  if (looksLikeStoragePath(value)) {
    return buildSupabasePublicUrl(value);
  }

  return "/placeholder-car.jpg";
}

export function getVehicleImage(vehicle: {
  images?: unknown;
  cover_image?: string | null;
  image?: string | null;
  image_url?: string | null;
}) {
  const parsedImages = normalizeImagesField(vehicle.images);

  const candidates = [
    parsedImages[0],
    vehicle.cover_image ?? null,
    vehicle.image ?? null,
    vehicle.image_url ?? null,
  ];

  for (const candidate of candidates) {
    const safe = getSafeImageSrc(candidate);
    if (safe !== "/placeholder-car.jpg") {
      return safe;
    }
  }

  return "/placeholder-car.jpg";
}