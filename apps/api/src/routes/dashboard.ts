import { FastifyInstance } from 'fastify';
import { db } from '../db';

export async function dashboardRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        const userId = request.headers['x-user-id'] as string;
        if (!userId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }

        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                teacherProfile: true,
                studentProfile: true,
            },
        });

        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        if (user.role === 'TEACHER') {
            if (!user.teacherProfile) {
                return reply.send({ role: 'TEACHER', needsOnboarding: true });
            }

            const activeStudentsCount = await db.studentTeacherRelation.count({
                where: {
                    teacherId: user.teacherProfile.id,
                    status: "ACTIVE",
                },
            });

            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const todayLessonsCount = await db.lesson.count({
                where: {
                    teacherId: user.teacherProfile.id,
                    startTime: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    status: {
                        not: "CANCELLED",
                    },
                },
            });

            const pendingHomeworkCount = await db.homeworkTracking.count({
                where: {
                    homework: {
                        lesson: {
                            teacherId: user.teacherProfile.id,
                        },
                    },
                    status: "SUBMITTED",
                },
            });

            const todaySchedule = await db.lesson.findMany({
                where: {
                    teacherId: user.teacherProfile.id,
                    startTime: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    status: {
                        not: "CANCELLED",
                    },
                },
                take: 5,
                orderBy: {
                    startTime: "asc",
                },
                include: {
                    students: {
                        include: {
                            user: true,
                        },
                    },
                    classroom: true,
                },
            });

            return reply.send({
                role: 'TEACHER',
                stats: {
                    activeStudentsCount,
                    todayLessonsCount,
                    pendingHomeworkCount,
                },
                schedule: todaySchedule,
            });
        }

        if (user.role === 'STUDENT') {
            if (!user.studentProfile) {
                return reply.send({ role: 'STUDENT', needsOnboarding: true });
            }

            const completedLessons = await db.lesson.count({
                where: {
                    students: {
                        some: {
                            id: user.studentProfile.id,
                        },
                    },
                    status: "COMPLETED",
                },
            });

            const homeworkCount = await db.homeworkTracking.count({
                where: {
                    studentId: user.studentProfile.id,
                    status: {
                        not: "COMPLETED",
                    },
                },
            });

            const nextLesson = await db.lesson.findFirst({
                where: {
                    students: {
                        some: {
                            id: user.studentProfile.id,
                        },
                    },
                    startTime: {
                        gt: new Date(),
                    },
                    status: {
                        not: "CANCELLED",
                    },
                },
                orderBy: {
                    startTime: "asc",
                },
                include: {
                    teacher: {
                        include: {
                            user: true,
                        },
                    },
                    classroom: true,
                },
            });

            const upcomingLessons = await db.lesson.findMany({
                where: {
                    students: {
                        some: {
                            id: user.studentProfile.id,
                        },
                    },
                    startTime: {
                        gte: new Date(),
                    },
                    status: {
                        not: "CANCELLED",
                    },
                },
                take: 5,
                orderBy: {
                    startTime: "asc",
                },
                include: {
                    teacher: {
                        include: {
                            user: true,
                        },
                    },
                    classroom: true,
                },
            });

            const pendingHomeworks = await db.homeworkTracking.findMany({
                where: {
                    studentId: user.studentProfile.id,
                    status: "PENDING",
                },
                include: {
                    homework: {
                        include: { lesson: true },
                    },
                },
                orderBy: { homework: { dueDate: "asc" } },
                take: 5,
            });

            return reply.send({
                role: 'STUDENT',
                stats: {
                    completedLessons,
                    homeworkCount,
                },
                nextLesson,
                upcomingLessons,
                pendingHomeworks,
            });
        }

        return reply.send({ role: user.role });
    });
}
