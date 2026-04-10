export type Vehicle = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
  color: string | null;
  description: string | null;
  cover_image: string | null;
  images: string[];
  is_published: boolean;
  is_featured: boolean;
  is_offer: boolean;
  is_new_arrival: boolean;
  views?: number | null;
  created_at?: string | null;

  body_type?: string | null;
  accepts_trade?: boolean | null;
  plate_ending?: string | null;
  ipva_paid?: boolean | null;
  licensed?: boolean | null;
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
  message: string;
  vehicle_id?: string;
};