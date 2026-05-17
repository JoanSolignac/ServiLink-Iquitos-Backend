import { registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => ({
    port: process.env.PORT,
    globalPrefix: process.env.GLOBAL_PREFIX,
}))