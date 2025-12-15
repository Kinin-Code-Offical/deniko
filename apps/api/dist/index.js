"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./env");
const fastify = (0, app_1.buildApp)();
const start = async () => {
    try {
        await fastify.listen({ port: env_1.env.PORT, host: '0.0.0.0' });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
