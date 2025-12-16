import { FastifyInstance } from 'fastify';
import { db } from '../db';

export async function publicRoutes(fastify: FastifyInstance) {
    fastify.get('/users', async (request, reply) => {
        return await db.user.findMany({
            where: {
                settings: {
                    profileVisibility: "public",
                },
                username: { not: null },
            },
            select: {
                username: true,
                updatedAt: true,
            },
        });
    });

    fastify.get('/stats', async (request, reply) => {
        const [tCount, sCount, lCount] = await Promise.all([
            db.teacherProfile.count(),
            db.studentProfile.count(),
            db.lesson.count(),
        ]);
        return {
            teacherCount: tCount,
            studentCount: sCount,
            lessonCount: lCount,
        };
    });

    fastify.get('/users/:username', async (request, reply) => {
        const { username } = request.params as { username: string };
        const user = await db.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                image: true,
                username: true,
                role: true,
                createdAt: true,
                settings: {
                    select: {
                        profileVisibility: true,
                        showAvatar: true,
                        showCourses: true,
                    }
                },
                teacherProfile: {
                    select: {
                        branch: true,
                        bio: true,
                    }
                }
            }
        });

        if (!user) return reply.code(404).send({ error: 'User not found' });
        if (user.settings?.profileVisibility !== 'public') return reply.code(404).send({ error: 'User not found' });

        return user;
    });
}
