import type { MetadataRoute } from "next";
import { createClient } from "@/lib/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.valerioveiculos.com.br";
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("slug, updated_at, created_at")
    .not("slug", "is", null);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/veiculos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  if (error || !data) {
    return staticPages;
  }

  const vehiclePages: MetadataRoute.Sitemap = data
    .filter((vehicle) => Boolean(vehicle.slug))
    .map((vehicle) => ({
      url: `${baseUrl}/veiculos/${vehicle.slug}`,
      lastModified: vehicle.updated_at ?? vehicle.created_at ?? new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [...staticPages, ...vehiclePages];
}