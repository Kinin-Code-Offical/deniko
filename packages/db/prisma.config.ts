import "dotenv/config";
import { defineConfig, env } from "prisma/config";

function envOptional(name: string): string | undefined {
    try {
        return env(name);
    } catch {
        return undefined;
    }
}

export default defineConfig({
    engine: "classic",
    schema: "prisma/schema.prisma",
    datasource: {
        url: envOptional("DATABASE_URL"),
        // @ts-expect-error: directUrl is not yet in the type definition
        directUrl: envOptional("DIRECT_URL"),
    },
});
