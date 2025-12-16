import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export * from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const createDb = (config: { isProduction: boolean; datasourceUrl?: string }) => {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;

    let adapter;
    if (config.datasourceUrl) {
        const pool = new Pool({ connectionString: config.datasourceUrl });
        adapter = new PrismaPg(pool);
    }

    const prisma = new PrismaClient({
        log: config.isProduction ? ['error'] : ['query', 'error', 'warn'],
        adapter,
    });

    if (!config.isProduction) globalForPrisma.prisma = prisma;

    return prisma;
};


