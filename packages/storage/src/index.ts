import { Storage, StorageOptions } from '@google-cloud/storage';

export interface StorageConfig {
    bucketName: string;
    options?: StorageOptions;
}

export const createStorage = (config: StorageConfig) => {
    const storage = new Storage(config.options);
    const bucket = storage.bucket(config.bucketName);

    return {
        bucket,
        getObjectStream(key: string) {
            const file = bucket.file(key);
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
        },
        async getSignedUrl(key: string, options: { action: 'read' | 'write' | 'delete' | 'resumable', expires: number }) {
            const file = bucket.file(key);
            const [url] = await file.getSignedUrl({
                version: 'v4',
                action: options.action,
                expires: options.expires,
            });
            return url;
        },
        async deleteObject(key: string) {
            const file = bucket.file(key);
            const [exists] = await file.exists();
            if (exists) {
                await file.delete();
                return true;
            }
            return false;
        }
    };
};


