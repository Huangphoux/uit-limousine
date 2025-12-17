import z from "zod";
import { generateSalt, hashPassword, verifyJwt } from "../../utils/encrypt.js";
import { logger } from "../../utils/logger.js";

const inputSchema = z.object({
    token: z.string(),
    newPassword: z.string(),
});

const outputSchema = z.object({
    message: z.literal("Password reset successfully")
});

export class ResetPasswordUsecase {
    constructor(tokenRepo, userRepo) {
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({
            task: "Reseting password"
        })
        log.info("Task started");

        const payload = verifyJwt(parsedInput.token);
        const userId = payload.sub;
        const tokenId = payload.jti;

        const exist = await this.tokenRepo.exist(tokenId, userId);
        if (!exist) {
            log.warn("Task failed: invalid token id");
            throw Error(`Invalid token`);
        }

        const user = await this.userRepo.findById(userId);
        if (!user) {
            log.warn("Task failed: invalid user id");
            throw Error(`Invalid token`);
        }

        const newPasswordHashed = hashPassword(parsedInput.newPassword, generateSalt());

        user.changePassword(newPasswordHashed);

        const savedUser = await this.userRepo.save(user);

        console.log("processed: ", user);
        console.log("save: ", savedUser);

        log.info("Task completed");
        await this.tokenRepo.delete(tokenId);

        return outputSchema.parse({
            message: "Password reset successfully"
        })
    }
}