import "server-only";
import { requireSession } from "./requireSession";
import { redirectToForbidden } from "./redirects";
import { Role } from "@/lib/user-api";

export async function requireRole(lang: string, allowedRoles: Role[]) {
    const { user, role } = await requireSession(lang);

    if (!allowedRoles.includes(role)) {
        redirectToForbidden(lang);
        throw new Error("Redirecting to forbidden");
    }

    return { user, role };
}
