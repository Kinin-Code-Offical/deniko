import { internalApiFetch } from "@/lib/internal-api";
import type { StudentTeacherRelation, StudentProfile, Classroom, User } from "@/types/api-models";

export type StudentDetailResponse = StudentTeacherRelation & {
    student: StudentProfile & {
        user: Pick<User, "id" | "name" | "firstName" | "lastName" | "email" | "image" | "phoneNumber"> | null;
        classrooms: Classroom[];
    };
};

export async function getStudents() {
    const res = await internalApiFetch("/student");
    if (!res.ok) return [];
    return await res.json();
}

export async function getStudent(id: string): Promise<StudentDetailResponse | null> {
    const res = await internalApiFetch(`/student/${id}`);
    if (!res.ok) return null;
    return await res.json() as Promise<StudentDetailResponse>;
}
