import { uploadFile } from './storage';
import { v4 as uuidv4 } from 'uuid';

// TODO: Update these keys to match the actual default avatars in your storage bucket
const DEFAULT_AVATARS = [
    'defaults/avatar-1.png',
    'defaults/avatar-2.png',
    'defaults/avatar-3.png',
    'defaults/avatar-4.png',
    'defaults/avatar-5.png',
];

export function getRandomDefaultAvatar(): string {
    const index = Math.floor(Math.random() * DEFAULT_AVATARS.length);
    return DEFAULT_AVATARS[index];
}

export function isDefaultAvatar(key: string | null | undefined): boolean {
    if (!key) return false;
    return DEFAULT_AVATARS.includes(key);
}

export async function uploadGoogleAvatar(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine extension from content-type or default to jpg
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const ext = contentType.split('/')[1] || 'jpg';

        const key = `avatars/${uuidv4()}.${ext}`;
        await uploadFile(key, buffer, contentType);
        return key;
    } catch (error) {
        console.error("Failed to upload Google avatar", error);
        return null;
    }
}
