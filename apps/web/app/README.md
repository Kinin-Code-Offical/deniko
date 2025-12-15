# App Directory Documentation

## Purpose

The `app/` directory contains the application's routing logic, pages, layouts, and API endpoints, following the Next.js App Router paradigm.

## Structure

- `[lang]/`: Dynamic route for Internationalization (i18n). All visible pages live here.
- `api/`: Backend API routes (Route Handlers).
- `actions/`: Server Actions for form submissions and mutations.
- `globals.css`: Global Tailwind styles.
- `layout.tsx`: Root layout (HTML/Body structure).

## Key Files

| File | Purpose | Key Exports | Dependencies |
|------|---------|-------------|--------------|
| `layout.tsx` | Root layout, providers, fonts | `RootLayout`, `metadata` | `next/font`, `components/providers` |
| `not-found.tsx` | 404 Page | `NotFound` | - |
| `api/auth/[...nextauth]/route.ts` | Auth.js Entrypoint | `GET`, `POST` | `auth.ts` |

## Getting Started

To add a new page:

1. Create a folder inside `app/[lang]/`.
2. Add `page.tsx`.
3. Use `params: { lang }` to fetch dictionaries.

```tsx
export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang);
  return <h1>{dict.home.title}</h1>;
}
```
