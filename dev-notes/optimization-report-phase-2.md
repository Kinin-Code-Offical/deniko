# Optimization Report - Phase 2

## Summary of Changes

We have further optimized the bundle size by addressing "Barrel File" issues and ensuring aggressive lazy loading in the Landing Page.

### 1. Landing Page (`app/[lang]/page.tsx`)

- **Issue:** Heavy components (`PerformanceCard`, `ScheduleCard`, etc.) and Animation components (`FadeIn`, `StaggerContainer`) were being imported statically. This caused their dependencies (`recharts`, `framer-motion`) to be included in the main bundle or the page's initial JS chunk.
- **Fix:** Converted ALL card imports and animation component imports to `next/dynamic`.
- **Code Change:**

  ```tsx
  // Dynamic imports for heavy components
  const ScheduleCard = dynamic(
    () => import("@/components/landing/carousel/cards/ScheduleCard")
  );
  const ProfileCard = dynamic(
    () => import("@/components/landing/carousel/cards/ProfileCard")
  );
  const PerformanceCard = dynamic(
    () => import("@/components/landing/carousel/cards/PerformanceCard")
  );
  // ...

  // Dynamic imports for animation components (Framer Motion)
  const FadeIn = dynamic(() =>
    import("@/components/ui/scroll-animation").then((mod) => mod.FadeIn)
  );
  // ...
  ```

- **Impact:**
  - `recharts` (used in `PerformanceCard`) is now strictly isolated to a separate chunk that is only loaded when `PerformanceCard` is needed.
  - `framer-motion` (used in `FadeIn`) is now split from the initial page load.

### 2. Dashboard (`app/[lang]/dashboard/page.tsx`)

- **Status:** Verified that `TeacherView` and `StudentView` are already using `next/dynamic`.
- **Check:** Confirmed no direct imports of `recharts` or `framer-motion` exist in this file.

### 3. Layout (`app/layout.tsx`)

- **Status:** Checked for heavy imports.
- **Findings:**
  - Imports `Providers`, `Toaster`, `CookieConsent`.
  - `Providers` uses `LazyMotion` (optimized).
  - `CookieConsent` uses `lucide-react` (named imports, tree-shakeable).
- **Verdict:** Layout is clean. No heavy widgets found.

### 4. Recharts & Framer Motion

- **Recharts:** Only used in `PerformanceChart.tsx`, which is lazy loaded by `PerformanceCard.tsx`, which is now lazy loaded by `app/[lang]/page.tsx`. Double isolation.
- **Framer Motion:** Only used in `scroll-animation.tsx` (now lazy loaded) and `MotionProvider` (using `LazyMotion`).

## Build Status

- **Command:** `ANALYZE=true npx next build --webpack`
- **Result:** Success.
- **Observation:** The build completed without errors. The `recharts` and `framer-motion` libraries should now be in separate chunks loaded on demand, significantly reducing the initial bundle size of the Landing Page.
