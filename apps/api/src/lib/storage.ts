import { Storage } from '@google-cloud/storage';
import { env } from '../env';

const storage = new Storage({
    projectId: env.GCS_PROJECT_ID,
});

const bucket = storage.bucket(env.GCS_BUCKET_NAME);

export async function getObjectStream(key: string) {
    const file = bucket.file(key);
    const [exists] = await file.exists();
    if (!exists) {
        throw new Error(`File not found: ${key}`);
    }
    return file.createReadStream();
}
