import type { MetadataRoute } from "next";

const baseUrl = "https://deniko.net";
const locales = ["tr", "en"];

// Public routes that should be indexed
const routes = [
    "", // Home
    "/login",
    "/register",
    "/join",
    "/legal/privacy",
    "/legal/terms",
    "/legal/cookies",
    "/legal/kvkk",
];

export default function sitemap(): MetadataRoute.Sitemap {
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

    // Add root URL (assuming middleware redirects to default locale)
    sitemapEntries.push({
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
    });

    return sitemapEntries;
}