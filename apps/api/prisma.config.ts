/// <reference types="node" />
import { defineConfig } from "prisma/config";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is missing");
}

export default defineConfig({
    schema: "../../packages/db/prisma/schema.prisma",
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
