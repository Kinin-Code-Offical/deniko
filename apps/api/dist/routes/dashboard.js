"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = dashboardRoutes;
const db_1 = require("../db");
async function dashboardRoutes(fastify) {
    fastify.get('/', async (request, reply) => {
        const userId = request.headers['x-user-id'];
        if (!userId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
        const user = await db_1.db.user.findUnique({
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
            const activeStudentsCount = await db_1.db.studentTeacherRelation.count({
                where: {
                    teacherId: user.teacherProfile.id,
                    status: "ACTIVE",
                },
            });
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const todayLessonsCount = await db_1.db.lesson.count({
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
            const pendingHomeworkCount = await db_1.db.homeworkTracking.count({
                where: {
                    homework: {
                        lesson: {
                            teacherId: user.teacherProfile.id,
                        },
                    },
                    status: "SUBMITTED",
                },
            });
            const todaySchedule = await db_1.db.lesson.findMany({
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
            const completedLessons = await db_1.db.lesson.count({
                where: {
                    students: {
                        some: {
                            id: user.studentProfile.id,
                        },
                    },
                    status: "COMPLETED",
                },
            });
            const homeworkCount = await db_1.db.homeworkTracking.count({
                where: {
                    studentId: user.studentProfile.id,
                    status: {
                        not: "COMPLETED",
                    },
                },
            });
            const nextLesson = await db_1.db.lesson.findFirst({
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
            const upcomingLessons = await db_1.db.lesson.findMany({
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
            const pendingHomeworks = await db_1.db.homeworkTracking.findMany({
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
