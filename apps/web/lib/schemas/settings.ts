import { z } from "zod";

export const profileBasicSchema = z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    username: z.string().min(3).max(30).optional(),
    phoneNumber: z.string().optional().nullable(),
    preferredCountry: z.string().optional().nullable(),
    preferredTimezone: z.string().optional().nullable(),
    notificationEmailEnabled: z.boolean().optional(),
    notificationInAppEnabled: z.boolean().optional(),
    isMarketingConsent: z.boolean().optional(),
    // Teacher fields
    branch: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    // Student fields
    studentNo: z.string().optional().nullable(),
    gradeLevel: z.string().optional().nullable(),
    parentName: z.string().optional().nullable(),
    parentPhone: z.string().optional().nullable(),
    parentEmail: z.string().email().optional().nullable().or(z.literal("")),
});

export const emailChangeSchema = z.object({
    newEmail: z.string().email(),
});
