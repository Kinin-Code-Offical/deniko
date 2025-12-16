export type Role = "ADMIN" | "TEACHER" | "STUDENT";
export type RelationStatus = "ACTIVE" | "ARCHIVED" | "PENDING" | "BLOCKED";
export type LessonType = "PRIVATE" | "GROUP" | "INSTITUTION";
export type LessonStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "MISSED";
export type LessonLocation = "ONLINE" | "TEACHER_HOME" | "STUDENT_HOME" | "INSTITUTION" | "OTHER";
export type PaymentType = "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "OTHER";
export type HomeworkStatus = "PENDING" | "COMPLETED" | "INCOMPLETE" | "MISSING" | "LATE" | "SUBMITTED";

export interface UserSettings {
    id: string;
    userId: string;
    profileVisibility: string;
    showAvatar: boolean;
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
    showCourses: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Homework {
    id: string;
    title: string;
    content: string | null;
    assignedDate: Date | string;
    dueDate: Date | string;
    lessonId: string;
}

export interface HomeworkTracking {
    id: string;
    homeworkId: string;
    studentId: string;
    status: HomeworkStatus;
    studentNote: string | null;
    teacherNote: string | null;
    fileId: string | null;
    checkedAt: Date | string | null;
}

export interface User {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    avatarVersion: number;
    phoneNumber: string | null;
    role: Role | null;
    isActive: boolean;
    isOnboardingCompleted: boolean;
    notificationEmailEnabled: boolean;
    notificationInAppEnabled: boolean;
    isMarketingConsent: boolean;
    preferredCountry: string | null;
    preferredTimezone: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface StudentProfile {
    id: string;
    userId: string | null;
    tempFirstName: string | null;
    tempLastName: string | null;
    tempPhone: string | null;
    tempEmail: string | null;
    tempAvatarKey: string | null;
    inviteToken: string | null;
    inviteTokenExpires: Date | string | null;
    isClaimed: boolean;
    creatorTeacherId: string | null;
    studentNo: string | null;
    gradeLevel: string | null;
    parentName: string | null;
    parentPhone: string | null;
    parentEmail: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface TeacherProfile {
    id: string;
    userId: string;
    branch: string;
    bio: string | null;
}

export interface StudentTeacherRelation {
    id: string;
    teacherId: string;
    studentId: string;
    status: RelationStatus;
    isCreator: boolean;
    customName: string | null;
    privateNotes: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Classroom {
    id: string;
    name: string;
    year: number;
    teacherId: string | null;
}

export interface Lesson {
    id: string;
    title: string;
    startTime: Date | string;
    endTime: Date | string;
    scheduleItemId: string | null;
    type: LessonType;
    status: LessonStatus;
    cancelReason: string | null;
    location: LessonLocation;
    locationUrl: string | null;
    address: string | null;
    publicNote: string | null;
    privateNote: string | null;
    price: number | null; // Decimal in Prisma is number or string in JS, usually string if preserving precision, but number for simple usage
    currency: string;
    isPaid: boolean;
    teacherId: string;
    classroomId: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Payment {
    id: string;
    amount: number; // Decimal
    date: Date | string;
    type: PaymentType;
    note: string | null;
    isVisibleToStudent: boolean;
    studentId: string;
    teacherId: string;
}
