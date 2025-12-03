import { Storage } from "@google-cloud/storage"
import { v4 as uuidv4 } from "uuid"

const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
})

const bucketName = process.env.GCS_BUCKET_NAME

export async function uploadFile(file: File, folder: string): Promise<string> {
    if (!bucketName) {
        throw new Error("GCS_BUCKET_NAME is not defined")
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const extension = file.name.split(".").pop()
    const fileName = `${folder}/${uuidv4()}.${extension}`
    const bucket = storage.bucket(bucketName)
    const fileRef = bucket.file(fileName)

    await fileRef.save(buffer, {
        contentType: file.type,
        metadata: {
            cacheControl: "private, max-age=3600",
        },
    })

    return fileName
}

export async function getFileStream(path: string) {
    if (!bucketName) {
        throw new Error("GCS_BUCKET_NAME is not defined")
    }

    const bucket = storage.bucket(bucketName)
    const file = bucket.file(path)

    return file.createReadStream()
}

export async function getFileMetadata(path: string) {
    if (!bucketName) {
        throw new Error("GCS_BUCKET_NAME is not defined")
    }

    const bucket = storage.bucket(bucketName)
    const file = bucket.file(path)
    const [metadata] = await file.getMetadata()

    return metadata
}

export async function deleteFile(path: string) {
    if (!bucketName) {
        throw new Error("GCS_BUCKET_NAME is not defined")
    }

    const bucket = storage.bucket(bucketName)
    const file = bucket.file(path)

    try {
        const [exists] = await file.exists()
        if (exists) {
            await file.delete()
            return true
        }
        return false
    } catch (error) {
        console.error("Error deleting file:", error)
        return false
    }
}