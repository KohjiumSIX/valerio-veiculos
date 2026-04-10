import { MetadataRoute } from "next";

// Se tiver banco (Supabase), depois podemos puxar os veículos dinâmicos aqui

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://valerioveiculos.com.br";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/veiculos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    // EXEMPLOS (quando tiver veículos dinâmicos)
    // {
    //   url: `${baseUrl}/veiculos/civic-2020`,
    //   lastModified: new Date(),
    //   changeFrequency: "weekly",
    //   priority: 0.8,
    // },
  ];
}