"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";
import logger from "@/lib/logger";
import { internalApiFetch } from "@/lib/internal-api";
import { privacySchema } from "@/lib/schemas/privacy";

export async function updateProfilePrivacyAction(input: unknown, lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) {
        return { error: dictionary.server.errors.unauthorized };
    }

    const result = privacySchema.safeParse(input);

    if (!result.success) {
        logger.warn({
            event: "privacy_settings_invalid_input",
            errors: result.error.flatten(),
            userId: session.user.id,
            input,
        }, "Invalid input for privacy settings");
        return { error: dictionary.server.errors.invalid_input };
    }

    try {
        const res = await internalApiFetch("/privacy", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.user.id,
            },
            body: JSON.stringify(result.data),
        });

        if (!res.ok) {
            throw new Error("Failed to update privacy settings");
        }

        logger.info({
            event: "privacy_settings_updated",
            userId: session.user.id,
            settings: result.data,
        });

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        logger.error({ event: "update_privacy_settings_error", error, userId: session.user.id });
        return { error: dictionary.server.errors.failed_update_profile };
    }
}
