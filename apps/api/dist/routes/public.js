"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoutes = publicRoutes;
const db_1 = require("../db");
async function publicRoutes(fastify) {
    fastify.get('/users', async (request, reply) => {
        return await db_1.db.user.findMany({
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
            db_1.db.teacherProfile.count(),
            db_1.db.studentProfile.count(),
            db_1.db.lesson.count(),
        ]);
        return {
            teacherCount: tCount,
            studentCount: sCount,
            lessonCount: lCount,
        };
    });
    fastify.get('/users/:username', async (request, reply) => {
        const { username } = request.params;
        const user = await db_1.db.user.findUnique({
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
        if (!user)
            return reply.code(404).send({ error: 'User not found' });
        if (user.settings?.profileVisibility !== 'public')
            return reply.code(404).send({ error: 'User not found' });
        return user;
    });
}
