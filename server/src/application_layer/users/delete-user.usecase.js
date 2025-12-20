import z from "zod";
import { logger } from "../../utils/logger.js";

export const inputSchema = z.object({
    authId: z.string(),
    id: z.string(),
});

export class DeleteUserByAdminUsecase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({ task: "Admin deleting user", adminId: parsedInput.authId, targetUserId: parsedInput.id });
        log.info("Task started");

        const user = await this.userRepository.findById(parsedInput.id);
        if (!user) {
            log.warn("Task failed: user not found");
            throw new Error("User not found");
        }

        // Không cho phép tự xóa chính mình
        if (user.id === parsedInput.authId) {
             throw new Error("Cannot delete yourself");
        }

        await this.userRepository.delete(parsedInput.id);
        log.info("Task completed");

        return { success: true, message: "User deleted successfully" };
    }
}