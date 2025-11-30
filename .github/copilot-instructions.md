. Project Context & Status

Deniko is a professional SaaS platform for hybrid tutors.

    Current Phase: Post-Launch / Core Feature Development.

    Completed Modules:

        Infrastructure: Deployed on Google Cloud Run (Dockerized), Domain connected (deniko.net).

        Authentication: Google Auth + Manual Register (Bcrypt) + Email Verification (Nodemailer) + Resend Cooldown.

        Onboarding: Role selection (Teacher/Student) + Profile completion (Phone/Password) + "Draft User" protection.

        UI Base: 50/50 Split Layout for Auth, Shadcn/UI integration, Branding (Deep Blue SVG Logo).

2. Tech Stack (Strict Versions)

    Framework: Next.js 15 (App Router) with i18n routing ([locale]).

    Language: TypeScript (Strict mode).

    Database: PostgreSQL (Google Cloud SQL) via Prisma ORM v6.

    Auth: NextAuth.js (Auth.js) v5 Beta (Prisma Adapter).

    UI: Tailwind CSS v4 + Shadcn/UI.

    State Management: Server Actions (Mutations) + React Server Components (Fetching).

3. Coding Standards & Architecture

A. Next.js & Server Actions

    Server First: Fetch data directly in Server Components using db (Prisma). Use use client ONLY for interactive leaf components (forms, buttons, charts).

    Mutations: Use Server Actions for all create/update/delete operations.

        Validation: Always validate inputs with Zod schemas inside the action.

        Auth Check: Always call await auth() inside actions. If session is null, throw error.

        Revalidation: Use revalidatePath after mutations.

B. Database & Prisma (Business Logic)

    Singleton: Always import db from @/lib/db.

    Shadow Accounts: Understand the StudentProfile model. It may NOT have a userId (Shadow Account created by Teacher). Handle nullable userId.

    Transactions: Use db.$transaction for multi-step writes (e.g., Creating a User AND a Profile).

C. UI/UX Guidelines

    Design System: "Sophisticated Simplicity". Clean, high-end, trustworthy.

    Components: Reuse components/ui/*.

    Colors: Primary Brand: Blue-600. Backgrounds: Slate-50 to Blue-50 gradients.

    Responsive: All dashboards (Tables, Cards) must be mobile-friendly (use Sheet for sidebars on mobile).

    Language: Default content language is Turkish.

4. Specific Module Rules (Do Not Break These)

Auth & Onboarding

    Redirects: Do not mess with the login/register redirect logic. It handles "Already Logged In" states.

    Verification: Manual users MUST have emailVerified. Google users get it automatically via auth.ts.

    Onboarding: Users cannot access /dashboard if isOnboardingCompleted is false.

Dashboard Architecture (Next Step)

    Route: /dashboard is a layout shell.

    Role Separation:

        Teacher: Sees "Students", "Schedule", "Finance".

        Student: Sees "My Lessons", "Homework", "Exams".

    Navigation: Use config/site.ts to manage menu items per role.

5. Docker & Deployment Safety

    Environment: Never hardcode secrets. Use process.env.

    Build: Ensure no new package breaks the standalone output.

    Images: If using next/image, ensure external domains (Google, Storage) are allowed in next.config.ts.

6. Directory Structure

Plaintext

app/
  [locale]/
    (auth)/       -> login, register, verify, onboarding
    dashboard/    -> Protected routes (layout.tsx checks role)
      page.tsx    -> Dispatches to TeacherView or StudentView
      students/   -> Student management
      finance/    -> Payment tracking
components/
  ui/             -> Shadcn primitives
  dashboard/      -> Shell, Sidebar, Nav
  features/       -> Specific modules (e.g. StudentTable, AddLessonForm)
lib/
  db.ts           -> Prisma client
  auth.ts         -> NextAuth config
  email.ts        -> Mailer utility