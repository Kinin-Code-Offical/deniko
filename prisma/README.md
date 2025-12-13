# Prisma Directory Documentation

## Purpose

Contains the database schema, migrations, and seed scripts.

## Structure

- `schema.prisma`: The single source of truth for the database model.
- `migrations/`: SQL migration history.
- `seed.ts` (optional): Script to populate initial data.

## Key Models

| Model | Purpose | Relationships |
|-------|---------|---------------|
| `User` | Core identity | `Account`, `Session`, `TeacherProfile`, `StudentProfile` |
| `UserSettings` | Privacy/Config | Belongs to `User` |
| `File` | Metadata for uploaded files | Owned by `User` |

## Workflow

1. Modify `schema.prisma`.
2. Run `pnpm prisma migrate dev --name <change_name>` to generate SQL and apply changes.
3. Run `pnpm prisma generate` to update the TypeScript client.
