# Scripts Directory Documentation

## Purpose

Contains utility scripts for maintenance, testing, and documentation generation.

## Scripts

| File | Purpose | Usage |
|------|---------|-------|
| `generate-docs.ts` | Generates Markdown API docs from TypeScript source | `pnpm docs:gen` |
| `check-env.ts` | Validates environment variables | `pnpm test:cli` |

## Internals

Scripts are written in TypeScript and executed via `tsx` (TypeScript Execute).
