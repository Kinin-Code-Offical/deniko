import type { MetadataRoute } from "next";
import { logger } from "@/lib/logger";
import { internalApiFetch } from "@/lib/internal-api";

export const dynamic = "force-dynamic";

const baseUrl = "https://deniko.net";
const locales = ["tr", "en"];

// Public routes that should be indexed.
// We explicitly exclude authenticated routes (e.g., /dashboard, /admin, /onboarding)
// to prevent 401/404 errors in search console.
const routes = [
  "", // Home
  "/join",
  "/legal",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
  "/legal/kvkk",
  "/faq",
  "/support",
  "/support/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add localized routes
  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });
  });

  // Add public user profiles
  try {
    const res = await internalApiFetch("/public/users");
    if (res.ok) {
      const users = await res.json() as { username: string; updatedAt: string }[];

      users.forEach((user) => {
        if (user.username) {
          locales.forEach((locale) => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/users/${user.username}`,
              lastModified: new Date(user.updatedAt),
              changeFrequency: "weekly",
              priority: 0.6,
            });
          });
        }
      });
    }
  } catch (error) {
    logger.warn({
      event: "sitemap_api_error",
      errorMessage: (error as Error).message,
    });
  }

  return sitemapEntries;
}
