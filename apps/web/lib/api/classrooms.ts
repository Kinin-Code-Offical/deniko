import { internalApiFetch } from "@/lib/internal-api";
import { parseJsonOrRedirect } from "@/lib/api-response";

export async function getClassrooms(lang?: string) {
    const res = await internalApiFetch("/classroom");
    return parseJsonOrRedirect<any[]>(res, { lang });
}
