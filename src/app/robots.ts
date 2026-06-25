import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://atoenglish.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/privacy", "/terms"],
        disallow: [
          "/dashboard",
          "/learn",
          "/flashcards",
          "/speaking",
          "/progress",
          "/roadmap",
          "/quiz",
          "/writing",
          "/leaderboard",
          "/grammar",
          "/business",
          "/challenge",
          "/pronunciation",
          "/placement-test",
          "/invite",
          "/certificate",
          "/settings",
          "/checkpoint",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

