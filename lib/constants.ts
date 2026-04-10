export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
  "5547984030116";

export const VEHICLE_SELECT_FIELDS = `
  id,
  slug,
  title,
  brand,
  model,
  year,
  price,
  km,
  fuel,
  transmission,
  color,
  description,
  cover_image,
  images,
  is_published,
  is_featured,
  is_offer,
  is_new_arrival,
  sold,
  views,
  body_type,
  accepts_trade,
  plate_ending,
  ipva_paid,
  licensed,
  created_at,
  updated_at
`;