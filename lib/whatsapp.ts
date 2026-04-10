type WhatsAppParams = {
  phone: string;
  vehicleName: string;
};

export function generateWhatsAppLink({
  phone,
  vehicleName,
}: WhatsAppParams) {
  const message = `Olá, tenho interesse no veículo: ${vehicleName}`;
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encodedMessage}`;
}