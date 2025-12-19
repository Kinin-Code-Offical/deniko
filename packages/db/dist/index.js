"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDb = void 0;
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
 *   datasourceUrl: 'postgresql://user:password@localhost:5432/db-name'
 * });
 * ```
 */
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
__exportStar(require("@prisma/client"), exports);
const globalForPrisma = globalThis;
const createDb = (config) => {
    if (globalForPrisma.prisma)
        return globalForPrisma.prisma;
    let adapter;
    if (config.datasourceUrl) {
        const pool = new pg_1.Pool({ connectionString: config.datasourceUrl });
        adapter = new adapter_pg_1.PrismaPg(pool);
    }
    const prisma = new client_1.PrismaClient({
        log: config.isProduction ? ['error'] : ['query', 'error', 'warn'],
        adapter,
    });
    if (!config.isProduction)
        globalForPrisma.prisma = prisma;
    return prisma;
};
exports.createDb = createDb;
