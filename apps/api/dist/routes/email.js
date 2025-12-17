"use strict";
let __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRoutes = emailRoutes;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../env");
const zod_1 = require("zod");
// System / No-Reply Transporter
const noReplyTransporter = nodemailer_1.default.createTransport({
  pool: true,
  host: env_1.env.SMTP_NOREPLY_HOST,
  port: parseInt(env_1.env.SMTP_NOREPLY_PORT),
  secure: parseInt(env_1.env.SMTP_NOREPLY_PORT) === 465,
  auth: {
    user: env_1.env.SMTP_NOREPLY_USER,
    pass: env_1.env.SMTP_NOREPLY_PASSWORD,
  },
  maxConnections: 5,
  maxMessages: 100,
});
// Support Transporter
const supportTransporter = nodemailer_1.default.createTransport({
  pool: true,
  host: env_1.env.SMTP_SUPPORT_HOST,
  port: parseInt(env_1.env.SMTP_SUPPORT_PORT),
  secure: parseInt(env_1.env.SMTP_SUPPORT_PORT) === 465,
  auth: {
    user: env_1.env.SMTP_SUPPORT_USER,
    pass: env_1.env.SMTP_SUPPORT_PASSWORD,
  },
  maxConnections: 5,
  maxMessages: 100,
});
const sendEmailSchema = zod_1.z.object({
  type: zod_1.z.enum(["noreply", "support"]),
  to: zod_1.z.string().email(),
  subject: zod_1.z.string(),
  html: zod_1.z.string().optional(),
  text: zod_1.z.string().optional(),
  replyTo: zod_1.z.string().email().optional(),
});
async function emailRoutes(fastify) {
  fastify.post("/send", async (request, reply) => {
    // TODO: Auth check (Internal API key or similar)
    const result = sendEmailSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({ error: result.error });
    }
    const { type, to, subject, html, text, replyTo } = result.data;
    const transporter =
      type === "support" ? supportTransporter : noReplyTransporter;
    const from =
      type === "support"
        ? `"Deniko Support" <${env_1.env.SMTP_SUPPORT_FROM}>`
        : `"Deniko" <${env_1.env.SMTP_NOREPLY_FROM}>`;
    try {
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text,
        replyTo,
      });
      return { success: true };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to send email" });
    }
  });
}
