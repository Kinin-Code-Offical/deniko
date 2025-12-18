/**
 * Creates and returns a Prisma client instance with optional connection pooling.
 * 
 * @param config - Configuration object for the database connection
 * @param config.isProduction - Whether the application is running in production mode. 
 *                               In production, only error logs are enabled. 
 *                               In development, the client is cached globally.
 * @param config.datasourceUrl - Optional database connection string. 
 *                               If provided, creates a PostgreSQL connection pool with adapter.
 * 
 * @returns A configured PrismaClient instance
 * 
 * @remarks
 * - In development mode, the Prisma client is cached globally to prevent multiple instances
 * - When a datasourceUrl is provided, uses PostgreSQL adapter with connection pooling
 * - Logging is configured based on environment: production logs only errors, 
 *   development logs queries, errors, and warnings
 * 
 * @example
 * ```typescript
 * const db = createDb({ 
 *   isProduction: false, 
 *   datasourceUrl: 'postgresql://user:password@localhost:5432/mydb' 
 * });
 * ```
 */
import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export * from './generated/client';

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


