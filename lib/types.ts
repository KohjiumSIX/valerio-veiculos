export type Vehicle = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;

  year: number | null;
  price: number | null;
  km: number | null;

  color: string | null;
  fuel: string | null;
  transmission: string | null;
  description: string | null;

  cover_image: string | null;
  images: string[] | null;

  is_published: boolean;
  is_featured: boolean;
  is_offer: boolean;
  is_new_arrival: boolean;
  sold: boolean;

  views: number | null;

  body_type: string | null;
  accepts_trade: boolean | null;

  // compatibilidade com nomes antigos/novos
plate_ending?: string | null;

  ipva_paid: boolean | null;
  licensed: boolean | null;

  created_at: string | null;
  updated_at: string | null;
};

export type Lead = {
  id: string;
  vehicle_id?: string | null;
  name: string;
  phone: string;
  message?: string | null;
  created_at?: string;
};

export type VehicleFormData = {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
  color: string;
  description: string;
  cover_image: string;
  images: string[];
  is_featured: boolean;
  is_offer: boolean;
  is_new_arrival: boolean;
  is_published: boolean;
};

export type LeadFormData = {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  vehicle_id?: string | null;
  vehicle_title?: string | null;
  source?: string | null;
};