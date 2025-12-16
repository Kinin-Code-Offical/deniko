import { internalApiFetch } from "@/lib/internal-api";

export async function getClassrooms() {
    const res = await internalApiFetch("/classroom");
    if (!res.ok) return [];
    return await res.json();
}
