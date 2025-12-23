import pino from "pino";
import pretty from "pino-pretty";

export class PinoLogger {
    constructor(pino) {
        this.logger = pino;
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

export const logger = new PinoLogger(pino({
    level: process.env.LOG_LEVEL || "debug",
    transport: {
        target: "pino-pretty",
        options: { colorize: true },
    },
}));