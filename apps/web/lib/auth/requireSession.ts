import "server-only";
import { auth } from "@/auth";
import { redirectToLogin } from "./redirects";
import { Role } from "@/lib/user-api";

export async function requireSession(lang: string) {
    const session = await auth();

    if (!session?.user) {
        redirectToLogin(lang);
        // redirect throws, so this line is unreachable, but for TS:
        throw new Error("Redirecting to login");
    }

    return {
        user: session.user,
        role: session.user.role as Role,
        session
    };
}
