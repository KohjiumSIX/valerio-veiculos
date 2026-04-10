import { createClient } from "@/lib/client";

const VEHICLE_BUCKET = "vehicles";
const MAX_FILE_SIZE_MB = 8;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function validateFile(file: File) {
  if (!file) {
    throw new Error("Arquivo inválido.");
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Cada imagem pode ter no máximo ${MAX_FILE_SIZE_MB} MB.`);
  }

  const fileExt = (file.name.split(".").pop() || "").toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
    throw new Error("Formato inválido. Use JPG, PNG ou WEBP.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Tipo de arquivo inválido. Use JPG, PNG ou WEBP.");
  }
}

export async function uploadVehicleImage(file: File) {
  validateFile(file);

  const supabase = createClient();

  const fileExt = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
  const filePath = `${Date.now()}-${safeName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(VEHICLE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
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
  if (!path?.trim()) return;

  const supabase = createClient();

  const normalizedPath = path
    .replace(/^https?:\/\/[^/]+\/storage\/v1\/object\/public\/vehicles\//, "")
    .replace(/^vehicles\//, "")
    .trim();

  if (!normalizedPath) return;

  const { error } = await supabase.storage
    .from(VEHICLE_BUCKET)
    .remove([normalizedPath]);

  if (error) {
    throw new Error(`Erro ao excluir imagem: ${error.message}`);
  }
}