import { createStorage } from '@deniko/storage';
import { env } from './env';
import { db } from './db';

export const prisma = db;


export const storage = createStorage({
    bucketName: env.GCS_BUCKET_NAME,
    options: {
        projectId: env.GCS_PROJECT_ID,
        credentials: {
            client_email: env.GCS_CLIENT_EMAIL,
            private_key: env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }
    }
});
