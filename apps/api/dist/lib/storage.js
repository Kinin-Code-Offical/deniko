"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectStream = getObjectStream;
const storage_1 = require("@google-cloud/storage");
const env_1 = require("../env");
const storage = new storage_1.Storage({
    projectId: env_1.env.GCS_PROJECT_ID,
    credentials: {
        client_email: env_1.env.GCS_CLIENT_EMAIL,
        private_key: env_1.env.GCS_PRIVATE_KEY,
    },
});
const bucket = storage.bucket(env_1.env.GCS_BUCKET_NAME);
async function getObjectStream(key) {
    const file = bucket.file(key);
    const [exists] = await file.exists();
    if (!exists) {
        throw new Error(`File not found: ${key}`);
    }
    return file.createReadStream();
}
