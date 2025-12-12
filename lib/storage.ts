import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/lib/env";
import logger from "@/lib/logger";

let storageInstance: Storage | null = null;
const bucketName = env.GCS_BUCKET_NAME;
const SIGNED_URL_TTL_MS = 60 * 60 * 1000; // 1 saat cache için yeterli

function getStorage() {
  if (!storageInstance) {
    storageInstance = new Storage({
      projectId: env.GCS_PROJECT_ID,
      credentials: {
        client_email: env.GCS_CLIENT_EMAIL,
        private_key: env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
    });
  }
  return storageInstance;
}

function getBucket() {
  if (!bucketName) throw new Error("GCS_BUCKET_NAME is not defined");
  return getStorage().bucket(bucketName);
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadFile(file: File, folder: string): Promise<string> {
  if (!bucketName) throw new Error("GCS_BUCKET_NAME is not defined");

  // Security: Validate folder name to prevent path traversal
  if (folder.includes("..") || folder.startsWith("/") || folder.includes("\\")) {
    throw new Error("Invalid folder name");
  }

  // Security: Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}`);
  }

  // Security: Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds limit: ${MAX_FILE_SIZE_BYTES} bytes`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop();
  // Security: Use UUID for filename to prevent overwrites and path traversal
  const fileName = `${folder}/${uuidv4()}.${extension}`;

  const fileRef = getBucket().file(fileName);

  await fileRef.save(buffer, {
    contentType: file.type,
    metadata: { cacheControl: "private, max-age=3600" },
  });

  return fileName;
}

export async function getSignedUrl(path: string): Promise<string | null> {
  if (!path) return null;
  const file = getBucket().file(path);

  try {
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + SIGNED_URL_TTL_MS,
    });
    return url;
  } catch (error) {
    logger.error({ error }, "Signed URL Error");
    return null;
  }
}

export async function getFileStream(path: string) {
  if (!bucketName) throw new Error("GCS_BUCKET_NAME is not defined");
  return getBucket().file(path).createReadStream();
}

export async function deleteFile(path: string): Promise<boolean> {
  if (!path) return false;
  if (!bucketName) throw new Error("GCS_BUCKET_NAME is not defined");
  try {
    await getBucket().file(path).delete();
    return true;
  } catch (error) {
    logger.error({ error }, "GCS Delete Error");
    return false;
  }
}
