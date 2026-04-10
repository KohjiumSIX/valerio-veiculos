import { createClient } from "@/lib/client";
import type { LeadFormData } from "@/lib/types";

export async function createLead(payload: LeadFormData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        name: payload.name,
        phone: payload.phone,
        email: payload.email || null,
        message: payload.message || null,
        vehicle_id: payload.vehicle_id || null,
        vehicle_title: payload.vehicle_title || null,
        source: payload.source || "site",
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}