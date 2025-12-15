# Contributing to Deniko

## Development Workflow

1.  **Clone & Install**
    ```bash
    git clone <repo>
    pnpm install
    ```

2.  **Environment Setup**
    - Copy `.env.example` to `.env`
    - Fill in required keys (DATABASE_URL, AUTH_SECRET, GCS_*)

3.  **Database**
    ```bash
    pnpm prisma migrate dev
    ```

4.  **Run Dev Server**
    ```bash
    pnpm dev
    ```

## Code Style
- **Linting**: ESLint is enforced. Run `pnpm lint`.
- **Formatting**: Prettier is enforced. Run `pnpm format`.
- **Commits**: Use Conventional Commits (feat, fix, docs, chore).

## Documentation
- Update `README.md` in folders if you add new files.
- Add TSDoc comments `/** ... */` to exported functions.
- Run `pnpm docs:gen` to update API docs.
