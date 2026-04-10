import { supabase } from "@/lib/supabase";
import type { LeadFormData } from "@/lib/types";

export async function createLead(payload: LeadFormData) {
  const cleanPhone = payload.phone.replace(/\D/g, "");

  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        vehicle_id: payload.vehicle_id || null,
        name: payload.name.trim(),
        phone: cleanPhone,
        message: payload.message?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao enviar lead: ${error.message}`);
  }

  return data;
}