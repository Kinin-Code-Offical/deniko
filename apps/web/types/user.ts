import type { User, TeacherProfile, StudentProfile, UserSettings } from "@deniko/db";

export type UserWithProfile = User & {
    teacherProfile?: TeacherProfile | null;
    studentProfile?: StudentProfile | null;
    settings?: UserSettings | null;
};
