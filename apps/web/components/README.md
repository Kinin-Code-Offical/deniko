# Components Directory Documentation

## Purpose

Contains reusable React components.

## Structure

- `ui/`: Generic, atomic UI components (buttons, inputs, dialogs). Mostly from Shadcn/UI.
- `auth/`: Authentication related forms and buttons.
- `dashboard/`: Complex dashboard widgets.
- `providers.tsx`: Global React Context providers (Theme, Session, Toast).

## Key Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `ui/button.tsx` | Standard Button | `variant`, `size`, `asChild` |
| `theme-toggle.tsx` | Dark/Light mode switch | - |
| `providers.tsx` | Wraps app with Contexts | `children` |

## Styling

We use **Tailwind CSS** with **class-variance-authority (cva)** for component variants.
