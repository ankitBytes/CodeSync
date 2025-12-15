import pino from "pino";

const production = process.env.NODE_ENV === "production";

const logger = pino({
    level: production ? "info" : "debug",
    transport: !production
    ? {
        target: "pino-pretty",
        options: { colorize: true }
      }
    : undefined,
})

export default logger;