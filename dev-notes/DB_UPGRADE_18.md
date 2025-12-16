# PostgreSQL Upgrade Note (v15 -> v18)

**Date:** 2025-12-13
**Status:** Completed

## Overview

The PostgreSQL database engine has been upgraded from version 15 to version 18.

## Changes Verified

- **CI/CD:** `.github/workflows/lighthouse.yml` is configured to use `postgres:18-alpine`.
- **Documentation:** `TECH_STACK.md` and `apps/api/README.md` have been updated to reflect the new version.
- **Prisma:** Prisma schema remains compatible (`provider = "postgresql"`).

## Action Items

- Ensure local development environments are updated to PostgreSQL 18 if running locally.
- Verify production database instance is upgraded to v18.
