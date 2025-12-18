"use server";

import { z } from "zod";
import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { sendEmailChangeVerificationEmail } from "@/lib/email";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import logger from "@/lib/logger";
import { internalApiFetch } from "@/lib/internal-api";

import { profileBasicSchema, emailChangeSchema } from "@/lib/schemas/settings";

// --- Actions ---

export async function updateProfileBasicAction(input: unknown, lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    const result = profileBasicSchema.safeParse(input);
    if (!result.success) return { error: dictionary.server.errors.invalid_input };

    try {
        const res = await internalApiFetch("/settings/profile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.user.id,
            },
            body: JSON.stringify(result.data),
        });

        if (!res.ok) {
            throw new Error("Failed to update profile");
        }

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        logger.error({ event: "update_profile_error", error, userId: session.user.id });
        return { error: dictionary.server.errors.failed_update_profile };
    }
}

export async function changePasswordAction(input: unknown, lang: string) {
    const dictionary = await getDictionary(lang as Locale);

    const changePasswordSchema = z
        .object({
            currentPassword: z.string().min(1),
            newPassword: z
                .string()
                .min(8)
                .regex(/[A-Z]/)
                .regex(/[a-z]/)
                .regex(/[0-9]/)
                .regex(/[!@#$%^&*(),.?":{}|<>]/),
            confirmPassword: z.string().min(8),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: dictionary.validation.passwords_do_not_match,
            path: ["confirmPassword"],
        });

    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    const result = changePasswordSchema.safeParse(input);
    if (!result.success) return { error: dictionary.server.errors.invalid_input };

    const { currentPassword, newPassword } = result.data;

    if (currentPassword === newPassword) {
        return { error: dictionary.server.errors.same_password };
    }

    try {
        const res = await internalApiFetch("/settings/password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.user.id,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!res.ok) {
            const errorData = await res.json() as { error?: string };
            if (errorData.error === 'user_not_found_password') return { error: dictionary.server.errors.user_not_found_password };
            if (errorData.error === 'incorrect_password') return { error: dictionary.server.errors.incorrect_password };
            throw new Error("Failed to change password");
        }

        logger.info({ event: "password_changed", userId: session.user.id });
        return { success: true };
    } catch (error) {
        logger.error({ event: "change_password_error", error, userId: session.user.id });
        return { error: dictionary.server.errors.failed_update_password };
    }
}

export async function requestEmailChangeAction(newEmail: string, lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    const result = emailChangeSchema.safeParse({ newEmail });
    if (!result.success) return { error: dictionary.server.errors.invalid_email };

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours

    try {
        const res = await internalApiFetch("/settings/email-change", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.user.id,
            },
            body: JSON.stringify({
                newEmail,
                token,
                expires: expires.toISOString(),
            }),
        });

        if (!res.ok) {
            const errorData = await res.json() as { error?: string };
            if (errorData.error === 'email_in_use') return { error: dictionary.server.errors.email_in_use };
            throw new Error("Failed to request email change");
        }

        await sendEmailChangeVerificationEmail(newEmail, token, lang as Locale);

        logger.info({
            event: "email_change_requested",
            userId: session.user.id,
            newEmail,
        });

        return { success: true };
    } catch (error) {
        logger.error({ event: "request_email_change_error", error, userId: session.user.id });
        return { error: dictionary.server.errors.failed_request_email_change };
    }
}

export async function deactivateAccountAction(lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    try {
        const res = await internalApiFetch("/settings/deactivate", {
            method: "POST",
            headers: {
                "x-user-id": session.user.id,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to deactivate account");
        }

        await signOut({ redirectTo: "/" });
        logger.info({
            event: "account_deactivated",
            userId: session.user.id,
            reason: "user_initiated",
        });
        return { success: true };
    } catch (error) {
        logger.error({ event: "deactivate_account_error", error, userId: session.user.id });
        return { error: dictionary.server.errors.failed_deactivate };
    }
}

export async function deleteAccountAction(lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    try {
        const res = await internalApiFetch("/settings/account", {
            method: "DELETE",
            headers: {
                "x-user-id": session.user.id,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to delete account");
        }

        await signOut({ redirectTo: "/" });
        logger.info({ event: "account_deleted", userId: session.user.id });
        return { success: true };
    } catch (error) {
        logger.error({ event: "delete_account_error", userId: session.user.id, error: (error as Error).message });
        return { error: dictionary.server.errors.failed_delete };
    }
}

// --- New Settings Actions ---

const notificationPreferencesSchema = z.object({
    emailEnabled: z.boolean(),
    inAppEnabled: z.boolean(),
});

const regionTimezoneSchema = z.object({
    country: z.string(),
    timezone: z.string(),
});

const cookiePreferencesSchema = z.object({
    analyticsEnabled: z.boolean(),
    marketingEnabled: z.boolean(),
});

const avatarUpdateSchema = z.object({
    type: z.enum(["uploaded", "default"]),
    url: z.string().optional(),
    key: z.string().optional(),
});

const DEFAULT_AVATAR_KEYS = [
    "default/avatars/avatar-1.png",
    "default/avatars/avatar-2.png",
    "default/avatars/avatar-3.png",
    "default/avatars/avatar-4.png",
    "default/avatars/avatar-5.png",
    "default/avatars/avatar-6.png",
];

export async function getDefaultAvatarsAction() {
    // Return API routes instead of signed URLs
    return DEFAULT_AVATAR_KEYS.map((key) => {
        // key is like "default/avatars/avatar-1.png"
        // route is /api/avatars/default/[...path]
        // we want /api/avatars/default/avatars/avatar-1.png
        // so we strip "default/" from the key
        const path = key.replace(/^default\//, "");
        return {
            key,
            url: `/api/avatars/default/${path}`
        };
    });
}


export async function updateNotificationPreferencesAction(input: unknown, lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    const result = notificationPreferencesSchema.safeParse(input);
    if (!result.success) return { error: dictionary.server.errors.invalid_input };

    try {
        const res = await internalApiFetch("/settings/notifications", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.user.id,
            },
            body: JSON.stringify(result.data),
        });

        if (!res.ok) {
            throw new Error("Failed to update notification preferences");
        }

        logger.info({
            event: "user_notification_preferences_updated",
            userId: session.user.id,
            emailEnabled: result.data.emailEnabled,
            inAppEnabled: result.data.inAppEnabled,
        });

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        logger.error({ event: "update_notification_preferences_failed", error });
        return { error: dictionary.server.errors.failed_update_notification_preferences };
    }
}

export async function updateRegionTimezonePreferencesAction(input: unknown, lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    const result = regionTimezoneSchema.safeParse(input);
    if (!result.success) return { error: dictionary.server.errors.invalid_input };

    try {
        const res = await internalApiFetch("/settings/region", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.user.id,
            },
            body: JSON.stringify(result.data),
        });

        if (!res.ok) {
            throw new Error("Failed to update region/timezone");
        }

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        logger.error({ event: "update_region_timezone_failed", error });
        return { error: dictionary.server.errors.failed_update_region_timezone };
    }
}

export async function updateCookiePreferencesAction(input: unknown, lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    const result = cookiePreferencesSchema.safeParse(input);
    if (!result.success) return { error: dictionary.server.errors.invalid_input };

    try {
        const res = await internalApiFetch("/settings/cookies", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.user.id,
            },
            body: JSON.stringify(result.data),
        });

        if (!res.ok) {
            throw new Error("Failed to update cookie preferences");
        }

        logger.info({
            event: "user_cookie_preferences_updated",
            userId: session.user.id,
            analyticsEnabled: result.data.analyticsEnabled,
            marketingEnabled: result.data.marketingEnabled,
        });

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        logger.error({ event: "update_cookie_preferences_failed", error });
        return { error: dictionary.server.errors.failed_update_cookie_preferences };
    }
}

export async function updateAvatarAction(input: unknown, lang: string) {
    const dictionary = await getDictionary(lang as Locale);
    const session = await auth();
    if (!session?.user?.id) return { error: dictionary.server.errors.unauthorized };

    const result = avatarUpdateSchema.safeParse(input);
    if (!result.success) return { error: dictionary.server.errors.invalid_input };

    try {
        const res = await internalApiFetch("/settings/avatar", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": session.user.id,
            },
            body: JSON.stringify(result.data),
        });

        if (!res.ok) {
            const errorData = await res.json() as { error?: string };
            if (errorData.error === 'no_image_provided') return { error: dictionary.server.errors.no_image_provided };
            throw new Error("Failed to update avatar");
        }

        logger.info({
            event: "profile_avatar_updated",
            userId: session.user.id,
            avatarType: result.data.type,
        });

        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard/profile");
        return { success: true };
    } catch (error) {
        logger.error({ event: "update_avatar_failed", error });
        return { error: dictionary.server.errors.failed_update_avatar };
    }
}
