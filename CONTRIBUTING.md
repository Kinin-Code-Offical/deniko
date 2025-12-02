# Contributing to Deniko

Thank you for your interest in contributing to Deniko! This document provides guidelines and information to help you contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please be kind and considerate to other contributors.

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- PostgreSQL 14.x or higher
- Git

### Setting Up Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/deniko-web.git
   cd deniko-web
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Kinin-Code-Offical/deniko-web.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local configuration
   ```

6. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

---

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Feature Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

---

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Avoid `any` types - use proper typing or `unknown` with type guards
- Export types and interfaces that are used across files

### React Components

- Use functional components with hooks
- Server Components by default, add `"use client"` only when necessary
- Use Shadcn/UI components from `@/components/ui`

### Logging

**❌ Don't use:**
```typescript
console.log("debug message")
console.error("error occurred")
```

**✅ Do use:**
```typescript
import logger from "@/lib/logger"

logger.info({ context: "auth", userId }, "User logged in")
logger.error({ context: "payment", error }, "Payment failed")
```

### Internationalization (i18n)

**❌ Don't hardcode text:**
```typescript
<h1>Welcome to Dashboard</h1>
```

**✅ Do use dictionary:**
```typescript
<h1>{dictionary.dashboard.welcome}</h1>
```

### Server Actions

All Server Actions must:
1. Check authentication at the start
2. Validate input with Zod schemas
3. Return standardized response objects

```typescript
"use server"

import { auth } from "@/auth"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
})

export async function myAction(data: z.infer<typeof schema>) {
  // 1. Check authentication
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  // 2. Validate input
  const validated = schema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }

  // 3. Perform action...
  
  // 4. Return standardized response
  return { success: true, message: "Action completed" }
}
```

### File Organization

```
components/
├── ui/           # Shadcn/UI primitives (Button, Input, etc.)
├── auth/         # Authentication components
├── dashboard/    # Dashboard-specific components
└── students/     # Student management components
```

### Import Paths

Always use absolute imports:
```typescript
// ✅ Good
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"

// ❌ Bad
import { Button } from "../../../components/ui/button"
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Examples

```bash
feat(auth): add Google OAuth support
fix(dashboard): resolve student list pagination issue
docs: update README with deployment instructions
style: format code with prettier
refactor(api): simplify error handling in student actions
```

---

## Pull Request Process

1. **Update your branch** with the latest changes from upstream
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests and linting**
   ```bash
   npm run lint
   npm run build
   ```

3. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub

5. **Fill out the PR template** with:
   - Description of changes
   - Related issue numbers
   - Screenshots (if UI changes)
   - Testing instructions

6. **Wait for review** and address any feedback

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] All text uses i18n dictionaries
- [ ] Server Actions check authentication
- [ ] No `console.log` statements (use `logger`)
- [ ] Prisma migrations are included (if schema changed)
- [ ] Build passes without errors
- [ ] Tests pass (if applicable)

---

## Reporting Bugs

### Before Submitting

1. Check existing issues to avoid duplicates
2. Try to reproduce the bug on the latest version
3. Collect relevant information (browser, OS, steps to reproduce)

### Bug Report Template

```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Node version: [e.g. 20.10.0]
```

---

## Feature Requests

### Before Submitting

1. Check existing issues and discussions
2. Consider if it aligns with the project goals
3. Think about implementation details

### Feature Request Template

```markdown
## Feature Description
A clear description of the feature.

## Problem it Solves
What problem does this feature address?

## Proposed Solution
How you think this should work.

## Alternatives Considered
Other approaches you've thought about.

## Additional Context
Any other relevant information.
```

---

## Questions?

If you have questions about contributing, please:

1. Check the documentation
2. Search existing issues
3. Create a new discussion on GitHub

---

Thank you for contributing to Deniko! 🎉
