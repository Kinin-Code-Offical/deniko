"use server";

import { signIn, signOut } from "@/auth";
import { internalApiFetch } from "@/lib/internal-api";
import { z } from "zod";
import { AuthError } from "next-auth";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";
import logger from "@/lib/logger";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";

/**
 * Logs out the current user and redirects to the login page.
 */
export async function logout() {
  await signOut({ redirectTo: "/login" });
}

/**
 * Initiates the Google OAuth sign-in flow.
 */
export async function googleSignIn() {
  await signIn("google", { redirectTo: "/onboarding" });
}

interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Authenticates a user with email and password.
 *
 * @param formData - The login form data (email, password).
 * @param lang - The current language locale.
 * @returns An object indicating success or failure with a message.
 */
export async function login(formData: LoginFormData, lang: string = "tr") {
  const dict = await getDictionary(lang as Locale);

  const loginSchema = z.object({
    email: z.string().email(dict.auth.login.validation.email_invalid),
    password: z.string().min(1, dict.auth.login.validation.password_required),
  });

  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    logger.warn({
      event: "login_validation_failed",
      errors: validatedFields.error.flatten(),
    });
    return { success: false, message: dict.auth.register.errors.invalid_data };
  }

  const { email, password } = validatedFields.data;

  logger.info({ event: "login_attempt", email });

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn({ event: "login_failed", email, errorType: error.type });
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: dict.auth.login.validation.invalid_credentials,
          };
        default:
          const cause = error.cause as
            | { err?: { message?: string; code?: string }; code?: string }
            | undefined;

          const code = cause?.err?.code || cause?.code;
          if (
            code === "TOO_MANY_LOGIN_ATTEMPTS_IP" ||
            code === "TOO_MANY_LOGIN_ATTEMPTS_USER"
          ) {
            return {
              success: false,
              message: dict.auth.login.validation.rate_limit,
            };
          }

          if (cause?.err?.message === "Email not verified") {
            return {
              success: false,
              message: dict.auth.verification.unverified_title,
              error: "NOT_VERIFIED",
              email: email // Return email so client can offer resend
            };
          }

          return {
            success: false,
            message: dict.server.errors.something_went_wrong,
          };
      }
    }
    throw error;
  }

  return { success: true };
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "TEACHER" | "STUDENT";
  phoneNumber?: string;
  marketingConsent?: boolean;
  browserTimezone?: string;
  browserCountry?: string;
}

export async function register(formData: RegisterFormData, lang: string = "tr") {
  const dict = await getDictionary(lang as Locale);

  const registerSchema = z.object({
    firstName: z.string().min(2, dict.auth.register.validation.first_name_min),
    lastName: z.string().min(2, dict.auth.register.validation.last_name_min),
    email: z.string().email(dict.auth.register.validation.email_invalid),
    password: z.string().min(8, dict.auth.register.validation.password_min),
    role: z.enum(["TEACHER", "STUDENT"]),
    phoneNumber: z.string().optional(),
    marketingConsent: z.boolean().optional(),
    browserTimezone: z.string().optional(),
    browserCountry: z.string().optional(),
  });

  const validatedFields = registerSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { success: false, message: dict.auth.register.errors.invalid_data };
  }

  const {
    firstName,
    lastName,
    email,
    password,
    role,
    phoneNumber,
    marketingConsent,
    browserTimezone,
    browserCountry,
  } = validatedFields.data;

  try {
    // Determine preferences based on browser data or fallback to lang
    let preferredCountry = browserCountry || "US";
    let preferredTimezone = browserTimezone || "UTC";

    if (!browserCountry && lang === "tr") {
      preferredCountry = "TR";
    }
    if (!browserTimezone && lang === "tr") {
      preferredTimezone = "Europe/Istanbul";
    }

    const res = await internalApiFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        role,
        phoneNumber,
        marketingConsent,
        preferredCountry,
        preferredTimezone,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json() as { error?: string };
      if (errorData.error === 'user_exists') { // ignore-hardcoded
        return { success: false, message: dict.auth.register.errors.user_exists };
      }
      throw new Error("Failed to register"); // ignore-hardcoded
    }

    const { token } = await res.json() as { token: string };

    await sendVerificationEmail(email, token, lang as Locale);

    logger.info({ event: "user_registered", email, role });

    return {
      success: true,
      message: dict.auth.register.success_title,
    };
  } catch (error) {
    logger.error({ event: "register_error", error });
    return { success: false, message: dict.auth.register.errors.generic };
  }
}

export async function verifyEmail(token: string, lang: string = "tr") {
  const dict = await getDictionary(lang as Locale);

  try {
    const res = await internalApiFetch("/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      const errorData = await res.json() as { error?: string };
      if (errorData.error === 'invalid_token') return { success: false, message: dict.auth.verify_page.messages.invalid_token, email: undefined };
      if (errorData.error === 'token_expired') return { success: false, message: dict.auth.verify_page.messages.expired_token, email: undefined }; // ignore-hardcoded
      if (errorData.error === 'user_not_found') return { success: false, message: dict.auth.verify_page.messages.user_not_found, email: undefined }; // ignore-hardcoded
      throw new Error("Failed to verify email"); // ignore-hardcoded
    }

    return { success: true, message: dict.auth.verify_page.messages.success };
  } catch (error) {
    logger.error({ event: "verify_email_error", error });
    return {
      success: false,
      message: dict.auth.verify_page.messages.error,
    };
  }
}

export async function resendVerificationEmail(email: string, lang: string = "tr") {
  const dict = await getDictionary(lang as Locale);

  try {
    const res = await internalApiFetch("/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json() as { error?: string };
      if (errorData.error === 'user_not_found') return { success: false, message: dict.auth.verification.user_not_found }; // ignore-hardcoded
      if (errorData.error === 'already_verified') return { success: false, message: dict.auth.verification.already_verified }; // ignore-hardcoded
      throw new Error("Failed to resend verification"); // ignore-hardcoded
    }

    const { token } = await res.json() as { token: string };

    await sendVerificationEmail(email, token, lang as Locale);

    return { success: true, message: dict.auth.verification.success };
  } catch (error) {
    logger.error({ event: "resend_verification_error", error });
    return {
      success: false,
      message: dict.auth.verification.error,
    };
  }
}

export async function forgotPassword(email: string, lang: string = "tr") {
  const dict = await getDictionary(lang as Locale);

  try {
    const res = await internalApiFetch("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json() as { error?: string };
      if (errorData.error === 'user_not_found') return { success: false, message: dict.server.errors.user_not_found }; // ignore-hardcoded
      throw new Error("Failed to request password reset"); // ignore-hardcoded
    }

    const { token } = await res.json() as { token: string };

    await sendPasswordResetEmail(email, token, lang as Locale);

    return { success: true, message: dict.auth.forgot_password.success };
  } catch (error) {
    logger.error({ event: "forgot_password_error", error });
    return {
      success: false,
      message: dict.server.errors.something_went_wrong,
    };
  }
}

export async function resetPassword(
  token: string,
  password: string,
  lang: string = "tr"
) {
  const dict = await getDictionary(lang as Locale);

  try {
    const res = await internalApiFetch("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (!res.ok) {
      const errorData = await res.json() as { error?: string };
      if (errorData.error === 'invalid_token') return { success: false, message: dict.auth.reset_password.invalid_token };
      if (errorData.error === 'token_expired') return { success: false, message: dict.auth.reset_password.expired_token }; // ignore-hardcoded
      if (errorData.error === 'user_not_found') return { success: false, message: dict.auth.reset_password.user_not_found }; // ignore-hardcoded
      if (errorData.error === 'same_password') return { success: false, message: dict.auth.reset_password.same_password }; // ignore-hardcoded
      throw new Error("Failed to reset password"); // ignore-hardcoded
    }

    return { success: true, message: dict.auth.reset_password.success };
  } catch (error) {
    logger.error({ event: "reset_password_error", error });
    return {
      success: false,
      message: dict.server.errors.something_went_wrong,
    };
  }
}

export async function verifyEmailChange(token: string, lang: string = "tr") {
  const dict = await getDictionary(lang as Locale);

  try {
    const res = await internalApiFetch("/auth/verify-email-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      const errorData = await res.json() as { error?: string };
      if (errorData.error === 'invalid_token') return { success: false, message: dict.server.errors.invalid_token };
      if (errorData.error === 'token_expired') return { success: false, message: dict.server.errors.token_expired }; // ignore-hardcoded
      if (errorData.error === 'email_in_use') return { success: false, message: dict.server.errors.email_in_use }; // ignore-hardcoded
      throw new Error("Failed to verify email change"); // ignore-hardcoded
    }

    return { success: true };
  } catch (error) {
    logger.error({ event: "verify_email_change_error", error });
    return { success: false, message: dict.server.errors.something_went_wrong };
  }
}

// Aliases for backward compatibility or component usage
export const verifyEmailChangeAction = verifyEmailChange;
export const registerUser = register;
export const resendVerificationCode = resendVerificationEmail;
export const resendVerificationEmailAction = resendVerificationEmail;

