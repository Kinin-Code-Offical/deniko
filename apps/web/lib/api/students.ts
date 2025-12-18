import { internalApiFetch } from "@/lib/internal-api";
import type { StudentTeacherRelation, StudentProfile, Classroom, User } from "@/types/api-models";
import { parseJsonOrRedirect } from "@/lib/api-response";

export type StudentDetailResponse = StudentTeacherRelation & {
    student: StudentProfile & {
        user: Pick<User, "id" | "name" | "firstName" | "lastName" | "email" | "image" | "phoneNumber"> | null;
        classrooms: Classroom[];
    };
};

export async function getStudents(lang?: string) {
    const res = await internalApiFetch("/student");
    return parseJsonOrRedirect<StudentDetailResponse[]>(res, { lang });
}

export async function getStudent(id: string, lang?: string): Promise<StudentDetailResponse> {
    const res = await internalApiFetch(`/student/${id}`);
    return parseJsonOrRedirect<StudentDetailResponse>(res, { lang });
}
