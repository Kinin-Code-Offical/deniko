import "server-only";
import { redirect, notFound } from "next/navigation";

export function redirectToLogin(lang: string, returnTo?: string) {
    const url = `/${lang}/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
    redirect(url);
}

export function redirectToForbidden(lang: string) {
    redirect(`/${lang}/forbidden`);
}

export function redirectToNotFound(_lang: string) {
    // Using standard notFound() which renders the closest not-found.tsx
    notFound();
}
