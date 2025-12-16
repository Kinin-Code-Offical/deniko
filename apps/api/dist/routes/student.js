"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRoutes = studentRoutes;
const zod_1 = require("zod");
const db_1 = require("../db");
const crypto_1 = require("crypto");
// Schemas
const createStudentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    surname: zod_1.z.string().min(2),
    studentNo: zod_1.z.string().optional(),
    grade: zod_1.z.string().optional(),
    tempPhone: zod_1.z.string().optional(),
    tempEmail: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    classroomIds: zod_1.z.array(zod_1.z.string()).optional().default([]),
    avatarUrl: zod_1.z.string().optional(),
});
const updateStudentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    surname: zod_1.z.string().min(2),
    studentNo: zod_1.z.string().optional(),
    grade: zod_1.z.string().optional(),
    tempPhone: zod_1.z.string().optional(),
    tempEmail: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    avatarUrl: zod_1.z.string().optional(),
});
async function studentRoutes(fastify) {
    // List Students
    fastify.get('/', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });
        if (!user?.teacherProfile) {
            return reply.code(403).send({ error: 'teacher_profile_not_found' });
        }
        const relations = await db_1.db.studentTeacherRelation.findMany({
            where: { teacherId: user.teacherProfile.id },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
                            }
                        },
                        classrooms: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return relations.map(rel => ({
            ...rel.student,
            relationId: rel.id,
            isCreator: rel.isCreator,
            // Map temp fields if user is not claimed, otherwise use user fields or fallback
            firstName: rel.student.user?.name?.split(' ')[0] || rel.student.tempFirstName,
            lastName: rel.student.user?.name?.split(' ').slice(1).join(' ') || rel.student.tempLastName,
            email: rel.student.user?.email || rel.student.tempEmail,
            avatar: rel.student.user?.image || rel.student.tempAvatarKey,
        }));
    });
    // Get Student Detail
    fastify.get('/:id', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { id } = request.params;
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });
        if (!user?.teacherProfile) {
            return reply.code(403).send({ error: 'teacher_profile_not_found' });
        }
        const relation = await db_1.db.studentTeacherRelation.findUnique({
            where: {
                teacherId_studentId: {
                    teacherId: user.teacherProfile.id,
                    studentId: id,
                }
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
                            }
                        },
                        classrooms: true,
                    }
                }
            }
        });
        if (!relation)
            return reply.code(404).send({ error: 'student_not_found' });
        return {
            ...relation.student,
            relationId: relation.id,
            isCreator: relation.isCreator,
            privateNotes: relation.privateNotes,
            firstName: relation.student.user?.name?.split(' ')[0] || relation.student.tempFirstName,
            lastName: relation.student.user?.name?.split(' ').slice(1).join(' ') || relation.student.tempLastName,
            email: relation.student.user?.email || relation.student.tempEmail,
            avatar: relation.student.user?.image || relation.student.tempAvatarKey,
        };
    });
    // Create Student
    fastify.post('/', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const data = createStudentSchema.parse(request.body);
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });
        if (!user?.teacherProfile) {
            return reply.code(403).send({ error: 'teacher_profile_not_found' });
        }
        const inviteToken = (0, crypto_1.randomBytes)(16).toString("hex");
        return await db_1.db.studentProfile.create({
            data: {
                tempFirstName: data.name,
                tempLastName: data.surname,
                studentNo: data.studentNo,
                gradeLevel: data.grade,
                tempPhone: data.tempPhone,
                tempEmail: data.tempEmail || null,
                tempAvatarKey: data.avatarUrl,
                inviteToken,
                inviteTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                teacherRelations: {
                    create: {
                        teacherId: user.teacherProfile.id,
                        isCreator: true,
                    },
                },
                classrooms: {
                    connect: data.classroomIds.map((id) => ({ id })),
                },
            },
        });
    });
    // Get Invite Details (Public)
    fastify.get('/invite/:token', async (request, reply) => {
        const { token } = request.params;
        const student = await db_1.db.studentProfile.findUnique({
            where: { inviteToken: token },
            select: {
                id: true,
                tempFirstName: true,
                tempLastName: true,
                tempAvatarKey: true,
                inviteTokenExpires: true,
                userId: true,
            },
        });
        if (!student)
            return reply.code(404).send({ error: 'invite_not_found' });
        if (student.userId)
            return reply.code(400).send({ error: 'already_claimed' });
        if (student.inviteTokenExpires && student.inviteTokenExpires < new Date()) {
            return reply.code(400).send({ error: 'invite_expired' });
        }
        return {
            ...student,
            name: student.tempFirstName,
            surname: student.tempLastName,
            avatar: student.tempAvatarKey
        };
    });
    // Claim Student Profile
    fastify.post('/claim', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { token } = request.body;
        const student = await db_1.db.studentProfile.findUnique({
            where: { inviteToken: token },
        });
        if (!student)
            return reply.code(404).send({ error: 'invite_not_found' });
        if (student.userId)
            return reply.code(400).send({ error: 'already_claimed' });
        if (student.inviteTokenExpires && student.inviteTokenExpires < new Date()) {
            return reply.code(400).send({ error: 'invite_expired' });
        }
        // Check if user already has a student profile
        const existingProfile = await db_1.db.studentProfile.findUnique({
            where: { userId },
        });
        if (existingProfile)
            return reply.code(400).send({ error: 'user_already_has_profile' });
        return await db_1.db.studentProfile.update({
            where: { id: student.id },
            data: {
                userId,
                inviteToken: null,
                inviteTokenExpires: null,
                isClaimed: true,
            },
        });
    });
    // Update Student
    fastify.patch('/:id', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { id } = request.params;
        const data = updateStudentSchema.parse(request.body);
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });
        if (!user?.teacherProfile) {
            return reply.code(403).send({ error: 'teacher_profile_not_found' });
        }
        // Verify relation
        const relation = await db_1.db.studentTeacherRelation.findUnique({
            where: {
                teacherId_studentId: {
                    teacherId: user.teacherProfile.id,
                    studentId: id,
                }
            }
        });
        if (!relation)
            return reply.code(404).send({ error: 'student_not_found' });
        return await db_1.db.studentProfile.update({
            where: { id },
            data: {
                tempFirstName: data.name,
                tempLastName: data.surname,
                studentNo: data.studentNo,
                gradeLevel: data.grade,
                tempPhone: data.tempPhone,
                tempEmail: data.tempEmail || null,
                tempAvatarKey: data.avatarUrl,
            }
        });
    });
    // Delete Student (Unlink or Delete)
    fastify.delete('/:id', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { id } = request.params;
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });
        if (!user?.teacherProfile) {
            return reply.code(403).send({ error: 'teacher_profile_not_found' });
        }
        const relation = await db_1.db.studentTeacherRelation.findUnique({
            where: {
                teacherId_studentId: {
                    teacherId: user.teacherProfile.id,
                    studentId: id,
                }
            }
        });
        if (!relation)
            return reply.code(404).send({ error: 'student_not_found' });
        // If creator and not claimed, delete profile? Or just delete relation?
        // For now, let's just delete the relation.
        await db_1.db.studentTeacherRelation.delete({
            where: { id: relation.id }
        });
        // Optional: If no more relations and not claimed, delete profile?
        // This is a business logic decision.
        return { success: true };
    });
    // Regenerate Invite Token
    fastify.post('/:id/invite/regenerate', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { id } = request.params;
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });
        if (!user?.teacherProfile) {
            return reply.code(403).send({ error: 'teacher_profile_not_found' });
        }
        const relation = await db_1.db.studentTeacherRelation.findUnique({
            where: {
                teacherId_studentId: {
                    teacherId: user.teacherProfile.id,
                    studentId: id,
                }
            }
        });
        if (!relation)
            return reply.code(404).send({ error: 'student_not_found' });
        const inviteToken = (0, crypto_1.randomBytes)(16).toString("hex");
        const student = await db_1.db.studentProfile.update({
            where: { id },
            data: {
                inviteToken,
                inviteTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        });
        return { inviteToken: student.inviteToken };
    });
    // Toggle Invite Link
    fastify.post('/:id/invite/toggle', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const { id } = request.params;
        const { enable } = request.body;
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });
        if (!user?.teacherProfile) {
            return reply.code(403).send({ error: 'teacher_profile_not_found' });
        }
        const relation = await db_1.db.studentTeacherRelation.findUnique({
            where: {
                teacherId_studentId: {
                    teacherId: user.teacherProfile.id,
                    studentId: id,
                }
            }
        });
        if (!relation)
            return reply.code(404).send({ error: 'student_not_found' });
        let data = {};
        if (enable) {
            data = {
                inviteToken: (0, crypto_1.randomBytes)(16).toString("hex"),
                inviteTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            };
        }
        else {
            data = {
                inviteToken: null,
                inviteTokenExpires: null,
            };
        }
        return await db_1.db.studentProfile.update({
            where: { id },
            data
        });
    });
    fastify.get('/:id/avatar', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        const { id } = request.params;
        if (!userId)
            return reply.code(401).send({ error: 'Unauthorized' });
        const student = await db_1.db.studentProfile.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!student)
            return reply.code(404).send({ error: 'Student not found' });
        // Permission check
        let allowed = false;
        if (student.userId === userId) {
            allowed = true;
        }
        else {
            const relation = await db_1.db.studentTeacherRelation.findFirst({
                where: {
                    studentId: id,
                    teacher: { userId: userId },
                },
            });
            if (relation)
                allowed = true;
        }
        if (!allowed)
            return reply.code(403).send({ error: 'Forbidden' });
        return reply.send({ tempAvatarKey: student.tempAvatarKey });
    });
}
