# App Internals

## Routing Strategy

We use a `[lang]` dynamic segment at the root of the app to handle localization. Middleware rewrites URLs to include the default locale if missing.

## Data Fetching

- **Server Components**: Fetch data using `internalApiFetch` (communicates with `apps/api`). Direct DB access is NOT allowed.
- **Client Components**: Should generally receive data via props or use Server Actions for mutations. Avoid `useEffect` for initial data load if possible.

## API Routes (`app/api`)

- **Authentication**: All API routes should check `auth()` session.
- **Response Format**: Standardize on JSON responses: `{ success: boolean, data?: any, error?: string }`.

## Error Handling

- `error.tsx` files are placed in segment roots to catch React Error Boundary exceptions.
- `not-found.tsx` handles 404s.
