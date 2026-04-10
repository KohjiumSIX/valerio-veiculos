// Formatar preço (R$)
export function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Formatar KM
export function formatKm(value: number) {
  return `${value.toLocaleString("pt-BR")} km`;
}

// Gerar slug (URL amigável)
export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}