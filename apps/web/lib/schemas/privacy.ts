import { z } from "zod";

export const privacySchema = z.object({
    profileVisibility: z.enum(["public", "private"]),
    showAvatar: z.boolean(),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
    allowMessages: z.boolean(),
    showCourses: z.boolean(),
});
