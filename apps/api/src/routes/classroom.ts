import { FastifyInstance } from 'fastify';
import { db } from '../db';

export async function classroomRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) return reply.code(401).send({ error: 'Unauthorized' });

        const user = await db.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user?.teacherProfile) {
            return reply.code(403).send({ error: 'teacher_profile_not_found' });
        }

        return await db.classroom.findMany({
            where: { teacherId: user.teacherProfile.id },
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        });
    });
}
