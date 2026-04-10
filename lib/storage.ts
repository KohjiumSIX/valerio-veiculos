import { createClient } from "@/lib/client";

const VEHICLE_BUCKET = "vehicles";

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function uploadVehicleImage(file: File) {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop() || "jpg";
  const safeName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
  const filePath = `${Date.now()}-${safeName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(VEHICLE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro ao enviar imagem: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from(VEHICLE_BUCKET)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
}

export async function deleteVehicleImage(path: string) {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(VEHICLE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(`Erro ao excluir imagem: ${error.message}`);
  }
}