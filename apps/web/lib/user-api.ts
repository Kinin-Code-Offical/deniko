import { internalApiFetch } from "@/lib/internal-api";
import "server-only";

// Define Role locally to avoid importing from @deniko/db
export enum Role {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    ADMIN = "ADMIN",
}

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    password?: string | null;
    role?: Role | null;
    isActive: boolean;
    isOnboardingCompleted: boolean;
    username?: string | null;
    avatarVersion: number;
}

interface RawUser extends Omit<User, 'emailVerified'> {
    emailVerified: string | null;
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T | null> {
    const res = await internalApiFetch(path, options);
    if (res.status === 404) return null;
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`User API Error: ${res.status} ${text}`);
    }
    return res.json() as Promise<T>;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await fetchJson<RawUser>(`/auth/adapter/user/email/${email}`);
    if (!user) return null;
    return { ...user, emailVerified: user.emailVerified ? new Date(user.emailVerified) : null };
}

export async function getUserById(id: string): Promise<User | null> {
    const user = await fetchJson<RawUser>(`/auth/adapter/user/${id}`);
    if (!user) return null;
    return { ...user, emailVerified: user.emailVerified ? new Date(user.emailVerified) : null };
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
    const res = await internalApiFetch("/auth/adapter/verify-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (res.status === 401 || res.status === 404) return null;

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`User API Error: ${res.status} ${text}`);
    }

    const user = await res.json() as RawUser;
    return { ...user, emailVerified: user.emailVerified ? new Date(user.emailVerified) : null };
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const user = await fetchJson<RawUser>(`/auth/adapter/user/username/${username}`);
    if (!user) return null;
    return { ...user, emailVerified: user.emailVerified ? new Date(user.emailVerified) : null };

}
