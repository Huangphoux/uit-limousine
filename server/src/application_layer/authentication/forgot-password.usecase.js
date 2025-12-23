import z from "zod";
import { logger } from "../../utils/logger.js";
import { generateJWT, generateUUID } from "../../utils/encrypt.js";
import { config } from "../../config.js";

const inputSchema = z.object({
    email: z.string(),
})

const outputShema = z.object({
    message: z.literal("Password reset email sent"),
})

export class RequestPasswordResetUsecase {
    constructor(userRead, tokenRepo, emailSender) {
        this.userRead = userRead;
        this.tokenRepo = tokenRepo;
        this.emailSender = emailSender;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({
            task: "Requesting password reset",
        })
        log.info("Task started");

        const userInfo = await this.userRead.getIdByEmail(parsedInput.email);
        if (!userInfo) {
            log.warn("Task failed: invalid email");
            throw Error(`Invalid email`);
        }

        const tokenId = generateUUID();
        const token = generateJWT({ sub: userInfo.id, jti: tokenId }, config.token.expiry);

        await this.tokenRepo.add(tokenId, userInfo.id);

        const link = `${config.frontend.url}/reset-password?token=${token}`;
        await this.emailSender.sendResetPassword(parsedInput.email, link);

        log.info("Task completed");
        return outputShema.parse({
            message: "Password reset email sent"
        })
    }
}