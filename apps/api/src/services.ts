import { createStorage } from '@deniko/storage';
import { env } from './env';
import { db } from './db';

export const prisma = db;


export const storage = createStorage({
    bucketName: env.GCS_BUCKET_NAME,
    options: {
        projectId: env.GCS_PROJECT_ID,
    }
});
