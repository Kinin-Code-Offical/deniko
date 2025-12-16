import { FastifyInstance } from 'fastify';
import nodemailer from 'nodemailer';
import { env } from '../env';
import { z } from 'zod';

// System / No-Reply Transporter
const noReplyTransporter = nodemailer.createTransport({
    pool: true,
    host: env.SMTP_NOREPLY_HOST,
    port: parseInt(env.SMTP_NOREPLY_PORT),
    secure: parseInt(env.SMTP_NOREPLY_PORT) === 465,
    auth: {
        user: env.SMTP_NOREPLY_USER,
        pass: env.SMTP_NOREPLY_PASSWORD,
    },
    maxConnections: 5,
    maxMessages: 100,
});

// Support Transporter
const supportTransporter = nodemailer.createTransport({
    pool: true,
    host: env.SMTP_SUPPORT_HOST,
    port: parseInt(env.SMTP_SUPPORT_PORT),
    secure: parseInt(env.SMTP_SUPPORT_PORT) === 465,
    auth: {
        user: env.SMTP_SUPPORT_USER,
        pass: env.SMTP_SUPPORT_PASSWORD,
    },
    maxConnections: 5,
    maxMessages: 100,
});

const sendEmailSchema = z.object({
    type: z.enum(['noreply', 'support']),
    to: z.string().email(),
    subject: z.string(),
    html: z.string().optional(),
    text: z.string().optional(),
    replyTo: z.string().email().optional(),
});

export async function emailRoutes(fastify: FastifyInstance) {
    fastify.post('/send', async (request, reply) => {
        // TODO: Auth check (Internal API key or similar)

        const result = sendEmailSchema.safeParse(request.body);
        if (!result.success) {
            return reply.code(400).send({ error: result.error });
        }

        const { type, to, subject, html, text, replyTo } = result.data;
        const transporter = type === 'support' ? supportTransporter : noReplyTransporter;
        const from = type === 'support'
            ? `"Deniko Support" <${env.SMTP_SUPPORT_FROM}>`
            : `"Deniko" <${env.SMTP_NOREPLY_FROM}>`;

        try {
            await transporter.sendMail({
                from,
                to,
                subject,
                html,
                text,
                replyTo
            });
            return { success: true };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to send email' });
        }
    });
}
