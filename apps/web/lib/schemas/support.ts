import { z } from "zod";

export const supportSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(5),
    type: z.enum(["general", "bug", "billing", "feature"]),
    message: z.string().min(10),
});
