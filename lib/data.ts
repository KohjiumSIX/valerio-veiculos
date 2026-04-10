export type Car = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  year: number;
  km: string;
  fuel: string;
  transmission: string;
  badge?: string;
};

export const featuredCars: Car[] = [
  {
    id: "1",
    slug: "honda-civic-touring-2020",
    title: "Honda Civic Touring",
    subtitle: "Sedã premium, completo e muito conservado",
    price: "R$ 89.900",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
    year: 2020,
    km: "48.000 km",
    fuel: "Flex",
    transmission: "Automático",
    badge: "Destaque",
  },
  {
    id: "2",
    slug: "toyota-corolla-xei-2021",
    title: "Toyota Corolla XEi",
    subtitle: "Conforto, confiabilidade e excelente procedência",
    price: "R$ 97.900",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    year: 2021,
    km: "39.000 km",
    fuel: "Flex",
    transmission: "Automático",
    badge: "Oferta",
  },
  {
    id: "3",
    slug: "jeep-compass-longitude-2022",
    title: "Jeep Compass Longitude",
    subtitle: "SUV moderno, espaçoso e impecável",
    price: "R$ 139.900",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    year: 2022,
    km: "31.000 km",
    fuel: "Flex",
    transmission: "Automático",
    badge: "Recém-chegado",
  },
];