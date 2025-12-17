import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
export declare const createDb: (config: {
    isProduction: boolean;
    datasourceUrl?: string;
}) => PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
