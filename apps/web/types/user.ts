import type { User, TeacherProfile, StudentProfile, UserSettings } from "@/types/api-models";

export type UserWithProfile = User & {
    teacherProfile?: (TeacherProfile & { _count?: { lessons: number; studentRelations: number } }) | null;
    studentProfile?: (StudentProfile & { _count?: { lessons: number } }) | null;
    settings?: UserSettings | null;
};
