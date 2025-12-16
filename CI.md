# CI/CD Pipeline Documentation

This document outlines the Continuous Integration (CI) steps for the Deniko monorepo.

## Prerequisites

- Node.js >= 18
- pnpm (managed via Corepack or installed globally)

## CI Steps

The following commands should be run in the CI environment:

1. **Install Dependencies**

    ```bash
    pnpm install
    ```

2. **Run Tests**
    Runs tests for all workspaces (api, web, packages).

    ```bash
    pnpm test:all
    ```

3. **Build Projects**
    Builds all applications and packages.

    ```bash
    pnpm build
    ```

## Notes

- **Determinism**: Tests are designed to be deterministic. External services (DB, Storage) should be mocked or provided via ephemeral containers (e.g., Docker Compose) if integration tests require them.
- **Environment Variables**: Ensure necessary environment variables (or `.env.test`) are present during the test phase.
