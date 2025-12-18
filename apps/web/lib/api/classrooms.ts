import { internalApiFetch } from "@/lib/internal-api";
import { parseJsonOrRedirect } from "@/lib/api-response";
import type { Classroom } from "@/types/api-models";

export async function getClassrooms(lang?: string) {
    const res = await internalApiFetch("/classroom");
    return parseJsonOrRedirect<Classroom[]>(res, { lang });
}
