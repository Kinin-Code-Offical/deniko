import { env } from "@/lib/env";
import "server-only";
import { v4 as uuidv4 } from "uuid";

const API_URL = env.INTERNAL_API_URL;

export async function uploadObject(
  key: string,
  data: Buffer | Uint8Array | string,
  options: { contentType: string; cacheControl?: string }
): Promise<void> {
  const buffer = Buffer.isBuffer(data)
    ? data
    : typeof data === 'string'
      ? Buffer.from(data)
      : Buffer.from(data);

  const base64Data = buffer.toString('base64');

  const res = await fetch(`${API_URL}/files/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key,
      data: base64Data,
      contentType: options.contentType
    })
  });

  if (!res.ok) {
    throw new Error(`Failed to upload file: ${res.statusText}`);
  }
}

export async function getObjectStream(key: string) {
  const res = await fetch(`${API_URL}/files/${encodeURIComponent(key)}`);
  if (!res.ok) {
    throw new Error(`File not found: ${key}`);
  }
  return res.body;
}

export async function getSignedUrlForKey(
  key: string,
  opts?: { expiresInSeconds?: number }
): Promise<string> {
  const res = await fetch(`${API_URL}/files/signed-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key,
      expiresInSeconds: opts?.expiresInSeconds
    })
  });

  if (!res.ok) {
    throw new Error(`Failed to get signed URL: ${res.statusText}`);
  }

  const json = await res.json() as { url: string };
  return json.url;
}

export async function deleteObject(key: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/files/${encodeURIComponent(key)}`, {
    method: 'DELETE'
  });

  if (!res.ok) return false;
  const json = await res.json() as { success: boolean };
  return json.success;
}

// --- Legacy/Helper Wrappers ---

export const deleteFile = deleteObject;

export const getSignedUrl = getSignedUrlForKey;

export async function uploadFile(file: File, folder: "avatars" | "files" | "uploads" = "uploads"): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop();
  const key = `${folder}/${uuidv4()}.${ext}`;

  await uploadObject(key, buffer, {
    contentType: file.type,
  });

  return key;
}

