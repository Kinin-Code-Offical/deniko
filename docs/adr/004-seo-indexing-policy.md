# ADR 004: SEO Indexing Policy

## Status

Accepted

## Context

We have user profiles and course content. Some content is public, some is private. We need to guide search engines to index only the right content.

## Decision

1. **Dynamic Sitemap**: `sitemap.ts` will query the database for *public* users and courses and generate URLs.
2. **Robots.txt**: `robots.ts` will allow `/` but disallow `/api/`, `/dashboard/`, and `/settings/`.
3. **Canonical URLs**: Every page must define a canonical URL in `generateMetadata` to prevent duplicate content issues.
4. **NoIndex**: Private profiles will return `robots: { index: false }` in their metadata.

## Consequences

- **Visibility**: Public profiles get organic traffic.
- **Privacy**: Private content is explicitly hidden from crawlers.

## References

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
