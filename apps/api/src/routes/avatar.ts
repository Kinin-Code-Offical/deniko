import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db';
import { env } from '../env';
import { createHmac } from 'crypto';
import { getObjectStream } from '../lib/storage';

export async function avatarRoutes(fastify: FastifyInstance) {
    fastify.get('/:userId', async (request, reply) => {
        const { userId } = request.params as { userId: string };

        // 1. Verify Signature
        const requesterId = request.headers['x-deniko-requester-id'] as string;
        const timestamp = request.headers['x-deniko-timestamp'] as string;
        const signature = request.headers['x-deniko-signature'] as string;

        if (!requesterId || !timestamp || !signature) {
            return reply.code(401).send({ error: 'Missing auth headers' });
        }

        // Check timestamp (max 60s drift)
        const ts = parseInt(timestamp, 10);
        const now = Date.now();
        if (Math.abs(now - ts) > 60000) {
            return reply.code(401).send({ error: 'Timestamp expired' });
        }

        // Verify HMAC
        const secret = env.INTERNAL_API_SECRET;
        const expectedSignature = createHmac('sha256', secret)
            .update(`${userId}:${requesterId}:${timestamp}`)
            .digest('hex');

        if (signature !== expectedSignature) {
            return reply.code(403).send({ error: 'Invalid signature' });
        }

        // 2. Check User & Privacy
        const targetUser = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                image: true,
                isActive: true,
                settings: {
                    select: {
                        profileVisibility: true,
                        showAvatar: true,
                    }
                }
            }
        });

        if (!targetUser || !targetUser.isActive) {
            return reply.code(404).send({ error: 'User not found' });
        }

        // Privacy Logic
        const isSelf = requesterId === userId;
        const isPrivateProfile = targetUser.settings?.profileVisibility === 'private';
        const isAvatarHidden = targetUser.settings?.showAvatar === false;

        if (!isSelf) {
            if (isPrivateProfile) {
                // If profile is private, no one sees anything (unless we add friend logic later)
                return reply.code(404).send({ error: 'User not found' });
            }
            if (isAvatarHidden) {
                // If avatar is specifically hidden
                return reply.code(404).send({ error: 'Avatar hidden' });
            }
        }

        // 3. Serve Image
        if (!targetUser.image) {
            // Return default avatar or 404? 
            // Usually 404 so frontend shows default.
            return reply.code(404).send({ error: 'No avatar set' });
        }

        try {
            // Assuming image field stores the storage key
            const stream = await getObjectStream(targetUser.image);

            // Determine content type (simple guess or stored)
            const contentType = targetUser.image.endsWith('.png') ? 'image/png' : 'image/jpeg';

            reply.header('Content-Type', contentType);

            // Cache control
            if (requesterId === userId) {
                reply.header('Cache-Control', 'private, no-store'); // Self sees latest
            } else {
                reply.header('Cache-Control', 'public, max-age=300'); // Others cache for 5m
            }

            return reply.send(stream);
        } catch (error) {
            request.log.error({ error, userId }, 'Failed to stream avatar');
            return reply.code(404).send({ error: 'Image not found' });
        }
    });
}
