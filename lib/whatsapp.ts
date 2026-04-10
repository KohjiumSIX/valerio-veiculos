type WhatsAppParams = {
  phone?: string;
  vehicleName: string;
};

function sanitizePhone(phone?: string) {
  return (phone || "").replace(/\D/g, "");
}

export function generateWhatsAppLink({
  phone,
  vehicleName,
}: WhatsAppParams) {
  const safePhone = sanitizePhone(phone);

  if (!safePhone) {
    throw new Error("Número de WhatsApp inválido.");
  }

  const message = `Olá, tenho interesse no veículo: ${vehicleName}`;
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${safePhone}?text=${encodedMessage}`;
}