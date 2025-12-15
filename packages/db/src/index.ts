import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const createDb = (config: { isProduction: boolean; datasourceUrl?: string }) => {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;

    const prisma = new PrismaClient({
        log: config.isProduction ? ['error'] : ['query', 'error', 'warn'],
        datasources: config.datasourceUrl ? {
            db: {
                url: config.datasourceUrl,
            },
        } : undefined,
    });

    if (!config.isProduction) globalForPrisma.prisma = prisma;

    return prisma;
};


