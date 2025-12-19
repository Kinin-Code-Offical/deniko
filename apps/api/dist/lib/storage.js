"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectStream = getObjectStream;
exports.uploadFile = uploadFile;
const storage_1 = require("@google-cloud/storage");
const env_1 = require("../env");
const storage = new storage_1.Storage({
    projectId: env_1.env.GCS_PROJECT_ID,
});
const bucket = storage.bucket(env_1.env.GCS_BUCKET_NAME);
function getObjectStream(key) {
    const file = bucket.file(key);
    return file.createReadStream();
}
async function uploadFile(key, buffer, contentType) {
    const file = bucket.file(key);
    await file.save(buffer, {
        contentType,
        resumable: false,
    });
}
