# Deniko - Modern Education Management Platform

<div align="center">
  <img src="public/logo.png" alt="Deniko Logo" width="200"/>
  
  **A comprehensive SaaS platform for teachers and students to manage tutoring sessions, schedules, homework, and payments.**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![License](https://img.shields.io/badge/License-Private-red?style=flat-square)]()
</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**Deniko** is a modern education management platform designed to digitize the tutoring experience. It provides tools for teachers to manage their students, schedule lessons, track homework, and handle payments, while giving students a clear view of their learning progress.

### Key Benefits

- 📚 **For Teachers:** Manage students, schedule lessons, assign homework, track attendance, and receive payments
- 🎓 **For Students:** View upcoming lessons, track homework assignments, and monitor progress
- 🌐 **Multi-language:** Full Turkish (TR) and English (EN) support
- 📱 **Responsive:** Works seamlessly on desktop, tablet, and mobile devices

---

## ✨ Features

### Authentication & Security
- 🔐 OAuth 2.0 with Google Sign-In
- 📧 Email/Password authentication with verification
- 🔑 Secure password reset flow
- 🛡️ JWT-based session management
- ✅ Email verification before login

### Teacher Dashboard
- 👥 Student management (add, edit, archive, delete)
- 📅 Lesson scheduling and calendar view
- 📝 Homework creation and tracking
- 💰 Payment tracking and finance management
- 📊 Performance analytics and statistics
- 📨 Invite links for student onboarding

### Student Dashboard
- 📆 View upcoming lessons
- ✅ Track homework assignments
- 📈 Monitor learning progress
- 👨‍🏫 Connect with multiple teachers

### Shadow Accounts
- Teachers can create "shadow accounts" for students before they register
- Students can claim their profile via invite link
- Automatic profile merging when students join

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM 6](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v5 (Beta)](https://authjs.dev/) |
| **Email** | [Nodemailer](https://nodemailer.com/) with Gmail SMTP |
| **Logging** | [Pino](https://getpino.io/) (Structured JSON logging) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **State Management** | React Server Components + Server Actions |
| **Deployment** | [Google Cloud Run](https://cloud.google.com/run) |

---

## 📁 Project Structure

```
deniko-web/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # i18n locale routes (tr/en)
│   │   ├── (auth)/               # Auth-related pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── dashboard/            # Protected dashboard routes
│   │   │   ├── students/
│   │   │   ├── schedule/
│   │   │   └── finance/
│   │   ├── onboarding/           # New user onboarding
│   │   └── legal/                # Terms & Privacy pages
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts
│   │   ├── student.ts
│   │   ├── onboarding.ts
│   │   └── user.ts
│   └── api/                      # API routes
│       └── auth/                 # NextAuth handlers
├── components/                   # React components
│   ├── ui/                       # Shadcn/UI primitives
│   ├── auth/                     # Auth-related components
│   ├── dashboard/                # Dashboard components
│   └── students/                 # Student management components
├── lib/                          # Utility functions & config
│   ├── db.ts                     # Prisma client singleton
│   ├── logger.ts                 # Pino logger config
│   ├── email.ts                  # Email templates & sending
│   ├── get-dictionary.ts         # i18n dictionary loader
│   └── utils.ts                  # Utility functions
├── dictionaries/                 # i18n translation files
│   ├── tr.json                   # Turkish translations
│   └── en.json                   # English translations
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma
│   └── migrations/
├── public/                       # Static assets
├── types/                        # TypeScript type definitions
├── config/                       # Configuration files
├── auth.ts                       # NextAuth configuration
├── i18n-config.ts                # i18n configuration
└── middleware.ts                 # Next.js middleware (locale detection)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **PostgreSQL** 14.x or higher
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kinin-Code-Offical/deniko-web.git
   cd deniko-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/deniko"
DIRECT_URL="postgresql://user:password@localhost:5432/deniko"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
AUTH_SECRET="your-auth-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Gmail SMTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

---

## 🗄️ Database

### Schema Overview

The database includes the following main models:

- **User** - Core user entity with role (TEACHER/STUDENT/ADMIN)
- **TeacherProfile** - Teacher-specific data
- **StudentProfile** - Student-specific data (supports shadow accounts)
- **StudentTeacherRelation** - Many-to-many relationship between teachers and students
- **Lesson** - Scheduled lessons with attendance tracking
- **Payment** - Financial transactions
- **Homework** - Assignments with tracking
- **TrialExam** - Exam results tracking (TYT, AYT, LGS, etc.)

### Running Migrations

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Prisma Studio

```bash
# Open Prisma Studio to browse data
npx prisma studio
```

---

## 🐳 Deployment

### Docker

The project includes a multi-stage Dockerfile optimized for production:

```bash
# Build the image
docker build -t deniko-web .

# Run the container
docker run -p 8080:8080 deniko-web
```

### Google Cloud Run

Deployment is automated via Cloud Build:

```bash
# Trigger a build manually
gcloud builds submit --config cloudbuild.yaml
```

The `cloudbuild.yaml` handles:
1. Building the Docker image with caching
2. Pushing to Container Registry
3. Deploying to Cloud Run

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Guidelines

1. **Logging:** Use `logger` from `@/lib/logger` instead of `console.log`
2. **i18n:** All user-facing text must come from dictionaries
3. **Validation:** Use Zod schemas for all form/API validation
4. **Server Actions:** Must check `await auth()` at the start
5. **Styling:** Follow existing Tailwind CSS patterns

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">
  <p>Built with ❤️ by the Deniko Team</p>
  <p>
    <a href="https://deniko.net">Website</a> •
    <a href="mailto:support@deniko.net">Support</a>
  </p>
</div>
