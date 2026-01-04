import pino from "pino";

export class PinoLogger {
    constructor(pinoInstance) { // Đổi tên tham số để tránh trùng với package pino
        this.logger = pinoInstance;
    }

    debug(message, context) {
        this.logger.debug({ ...context }, message);
    }

    info(message, context) {
        this.logger.info({ ...context }, message);
    }

    warn(message, context) {
        this.logger.warn({ ...context }, message);
    }

    error(message, context) {
        this.logger.error({ ...context }, message);
    }

    child(context) {
        const childLogger = this.logger.child(context);
        return new PinoLogger(childLogger);
    }
}


const transportConfig = process.env.NODE_ENV === "test"
    ? undefined
    : {
        target: "pino-pretty",
        options: { colorize: true },
    };

export const logger = new PinoLogger(
    pino({
        level: process.env.LOG_LEVEL || "debug",
        transport: transportConfig,
    })
);