import type { User, TeacherProfile, StudentProfile, UserSettings } from "@/types/api-models";

export type UserWithProfile = User & {
    teacherProfile?: TeacherProfile | null;
    studentProfile?: StudentProfile | null;
    settings?: UserSettings | null;
};
