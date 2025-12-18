import { type Adapter, type AdapterUser } from "next-auth/adapters";
import { internalApiFetch } from "@/lib/internal-api";

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T | null> {
    const res = await internalApiFetch(path, options);
    if (res.status === 404) return null;
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Auth Adapter Error: ${res.status} ${text}`);
    }
    return res.json() as Promise<T>;
}

export function CustomAdapter(): Adapter {
    return {
        async createUser(user) {
            const res = await fetchJson<AdapterUser>("/auth/adapter/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            if (!res) throw new Error("Failed to create user");
            return { ...res, emailVerified: res.emailVerified ? new Date(res.emailVerified) : null };
        },
        async getUser(id) {
            const res = await fetchJson<AdapterUser>(`/auth/adapter/user/${id}`);
            if (!res) return null;
            return { ...res, emailVerified: res.emailVerified ? new Date(res.emailVerified) : null };
        },
        async getUserByEmail(email) {
            const res = await fetchJson<AdapterUser>(`/auth/adapter/user/email/${email}`);
            if (!res) return null;
            return { ...res, emailVerified: res.emailVerified ? new Date(res.emailVerified) : null };
        },
        async getUserByAccount({ provider, providerAccountId }) {
            const res = await fetchJson<AdapterUser>(`/auth/adapter/user/account/${provider}/${providerAccountId}`);
            if (!res) return null;
            return { ...res, emailVerified: res.emailVerified ? new Date(res.emailVerified) : null };
        },
        async updateUser(user) {
            const res = await fetchJson<AdapterUser>(`/auth/adapter/user/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            if (!res) throw new Error("Failed to update user");
            return { ...res, emailVerified: res.emailVerified ? new Date(res.emailVerified) : null };
        },
        async deleteUser(userId) {
            await fetchJson(`/auth/adapter/user/${userId}`, { method: "DELETE" });
        },
        async linkAccount(account) {
            await fetchJson("/auth/adapter/account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(account),
            });
            return account;
        },
        async unlinkAccount({ provider, providerAccountId }) {
            await fetchJson(`/auth/adapter/account/${provider}/${providerAccountId}`, { method: "DELETE" });
        },
        // Session methods are not implemented as we use JWT strategy
        async createSession(_session) { return _session; },
        async getSessionAndUser(_sessionToken) { return null; },
        async updateSession(_session) { return null; },
        async deleteSession(_sessionToken) { return; },
        async createVerificationToken(verificationToken) { return verificationToken; },
        async useVerificationToken({ identifier: _identifier, token: _token }) { return null; },
    };
}
