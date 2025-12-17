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
const client_1 = require("./generated/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
__exportStar(require("./generated/client"), exports);
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
