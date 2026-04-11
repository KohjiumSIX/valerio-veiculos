import type { Vehicle } from "@/lib/types";
import { createClient } from "@/lib/server";
import { VEHICLE_SELECT_FIELDS } from "@/lib/constants";

export async function getPublishedVehicles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_SELECT_FIELDS)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar veículos publicados: ${error.message}`);
  }

  return (data ?? []) as Vehicle[];
}

export async function getFeaturedVehicles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_SELECT_FIELDS)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar veículos em destaque: ${error.message}`);
  }

  return (data ?? []) as Vehicle[];
}

export async function getOfferVehicles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_SELECT_FIELDS)
    .eq("is_published", true)
    .eq("is_offer", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar veículos em oferta: ${error.message}`);
  }

  return (data ?? []) as Vehicle[];
}

export async function getNewArrivalVehicles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_SELECT_FIELDS)
    .eq("is_published", true)
    .eq("is_new_arrival", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar recém-chegados: ${error.message}`);
  }

  return (data ?? []) as Vehicle[];
}

export async function getVehicleBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar veículo por slug:", error);
    return null;
  }

  return data;
}