"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const avatar_1 = require("./avatar");
const files_1 = require("./files");
const settings_1 = require("./settings");
const privacy_1 = require("./privacy");
const messages_1 = require("./messages");
async function registerRoutes(fastify) {
    fastify.register(avatar_1.avatarRoutes, { prefix: '/avatar' });
    fastify.register(files_1.filesRoutes, { prefix: '/files' });
    fastify.register(settings_1.settingsRoutes, { prefix: '/settings' });
    fastify.register(privacy_1.privacyRoutes, { prefix: '/privacy' });
    fastify.register(messages_1.messagesRoutes, { prefix: '/messages' });
}
