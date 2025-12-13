# ADR 005: Internationalization (i18n) Approach

## Status

Accepted

## Context

The application needs to support multiple languages (English, Turkish).

## Decision

We use **Path-based Routing** (`/[lang]/...`).

1. **Routing**: The locale is the first segment of the URL.
2. **Detection**: Middleware detects the user's preferred language (Accept-Language header) and redirects if the locale is missing.
3. **Storage**: Translations are stored in JSON files (`dictionaries/en.json`).
4. **Fetching**: Server Components fetch the dictionary async (`getDictionary(lang)`). Client components receive translated strings as props.

## Consequences

- **SEO**: Search engines see different URLs for different languages (`/en/about`, `/tr/about`), which is best practice.
- **Performance**: Dictionaries are loaded on the server, reducing client bundle size.

## References

- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
