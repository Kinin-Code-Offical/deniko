"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorage = void 0;
const storage_1 = require("@google-cloud/storage");
const createStorage = (config) => {
    const storage = new storage_1.Storage(config.options);
    const bucket = storage.bucket(config.bucketName);
    return {
        bucket,
        getObjectStream(key) {
            const file = bucket.file(key);
            return file.createReadStream();
        },
        async putObject(key, buffer, mimeType) {
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
        async getSignedUrl(key, options) {
            const file = bucket.file(key);
            const [url] = await file.getSignedUrl({
                version: 'v4',
                action: options.action,
                expires: options.expires,
            });
            return url;
        },
        async deleteObject(key) {
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
exports.createStorage = createStorage;
