import { PrismaClient } from './generated/client';
export * from './generated/client';
export declare const createDb: (config: {
    isProduction: boolean;
    datasourceUrl?: string;
}) => PrismaClient<import("./generated/client").Prisma.PrismaClientOptions, never, import("./generated/client/runtime/client").DefaultArgs>;
