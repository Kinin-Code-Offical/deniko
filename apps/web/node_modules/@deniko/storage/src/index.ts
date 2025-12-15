import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || 'deniko-files';
const bucket = storage.bucket(bucketName);

export const storageClient = {
    bucket,
    async getObjectStream(key: string) {
        const file = bucket.file(key);
        const [exists] = await file.exists();
        if (!exists) return null;
        return file.createReadStream();
    },
    async putObject(key: string, buffer: Buffer, mimeType: string) {
        const file = bucket.file(key);
        await file.save(buffer, {
            contentType: mimeType,
            resumable: false,
        });
        return key;
    },
    async listDefaultAvatars() {
        const [files] = await bucket.getFiles({ prefix: 'default/' });
        return files.map(f => f.name);
    }
};
