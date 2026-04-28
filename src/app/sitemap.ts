import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pokopal.com";
  const guides = [
    "beginners-guide",
    "befriend-pokemon",
    "habitats-guide",
    "items-crafting",
    "dream-islands-guide",
  ];

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/guides/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...guides.map((slug) => ({
      url: `${baseUrl}/guides/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
