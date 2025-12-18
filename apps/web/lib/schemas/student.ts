import { z } from "zod";

export const createStudentSchema = z.object({
    name: z.string().min(2, "name_min_length"),
    surname: z.string().min(2, "surname_min_length"),
    studentNo: z.string().optional(),
    grade: z.string().optional(),
    tempPhone: z.string().optional(),
    tempEmail: z.string().email("invalid_email").optional().or(z.literal("")),
    classroomIds: z.array(z.string()).optional().default([]),
});

export const updateStudentSchema = z.object({
    studentId: z.string(),
    name: z.string().min(2, "name_min_length"),
    surname: z.string().min(2, "surname_min_length"),
    studentNo: z.string().optional(),
    grade: z.string().optional(),
    tempPhone: z.string().optional(),
    tempEmail: z.string().email("invalid_email").optional().or(z.literal("")),
});
