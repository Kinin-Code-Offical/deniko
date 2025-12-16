import { db } from './src/db';
import { getObjectStream } from './src/lib/storage';

async function main() {
    console.log("Starting check...");
    const userId = '35f4a71b-ef02-4e2d-9b2e-192c7283e5c0';
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, image: true, settings: true }
    });
    console.log(JSON.stringify(user, null, 2));

    if (user?.image) {
        console.log(`Checking storage for: ${user.image}`);
        try {
            const stream = await getObjectStream(user.image);
            console.log("Stream created successfully.");
        } catch (e) {
            console.error("Storage error:", e);
        }
    }
}

main().catch(console.error).finally(() => process.exit());
