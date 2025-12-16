"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import logger from "@/lib/logger";
import { internalApiFetch } from "@/lib/internal-api";

/**
 * Completes the onboarding process for a user.
 * Updates the user's role, phone number, password, and creates the corresponding profile.
 *
 * @param data - The onboarding data (role, phone, password, etc.).
 * @returns An object indicating success or failure.
 */
export async function completeOnboarding(data: {
  role: "TEACHER" | "STUDENT";
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  terms?: boolean;
  marketingConsent?: boolean;
  preferredTimezone?: string;
  preferredCountry?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "session_not_found" };
  }

  try {
    const res = await internalApiFetch("/onboarding/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json() as { error?: string };
      if (errorData.error) {
        return { success: false, error: errorData.error };
      }
      throw new Error("Failed to complete onboarding");
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    logger.error({ context: "completeOnboarding", error }, "Onboarding Error");
    return { success: false, error: "onboarding_error" };
  }
}
