# Troubleshooting

## Turbopack Root Issue

If you encounter "We couldn't find next/package.json" error with Turbopack:

1. Clean the `.next` cache in `apps/web`:

   ```powershell
   rmdir /s /q apps\web\.next
   ```

2. Reinstall dependencies and start dev server:

   ```powershell
   pnpm install
   pnpm dev
   ```
