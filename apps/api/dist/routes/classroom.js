"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classroomRoutes = classroomRoutes;
const db_1 = require("../db");
async function classroomRoutes(fastify) {
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
        return await db_1.db.classroom.findMany({
            where: { teacherId: user.teacherProfile.id },
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        });
    });
}
