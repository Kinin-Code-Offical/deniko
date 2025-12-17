import { StorageOptions } from '@google-cloud/storage';
export interface StorageConfig {
    bucketName: string;
    options?: StorageOptions;
}
export declare const createStorage: (config: StorageConfig) => {
    bucket: import("@google-cloud/storage").Bucket;
    getObjectStream(key: string): import("stream").Readable;
    putObject(key: string, buffer: Buffer, mimeType: string): Promise<string>;
    listDefaultAvatars(): Promise<string[]>;
    getSignedUrl(key: string, options: {
        action: "read" | "write" | "delete" | "resumable";
        expires: number;
    }): Promise<string>;
    deleteObject(key: string): Promise<boolean>;
};
