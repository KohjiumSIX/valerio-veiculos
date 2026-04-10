import { createClient } from "@/lib/client";

export async function trackVehicleEvent(
  vehicleId: string,
  type: "view" | "whatsapp"
) {
  const supabase = createClient();

  const { error } = await supabase.from("vehicle_events").insert([
    {
      vehicle_id: vehicleId,
      type,
    },
  ]);

  if (error) {
    console.error("Erro ao registrar evento:", error.message);
  }
}