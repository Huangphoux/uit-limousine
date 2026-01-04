import z from "zod";
import { logger } from "../../utils/logger.js";

export const inputSchema = z.object({
    authId: z.string(),
    id: z.string(),
    name: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).optional(),
    role: z.string().optional(),
});

export class UpdateUserByAdminUsecase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({ task: "Admin updating user", adminId: parsedInput.authId, targetUserId: parsedInput.id });
        log.info("Task started");

        const user = await this.userRepository.findById(parsedInput.id);
        if (!user) {
            log.warn("Task failed: user not found");
            throw new Error("User not found");
        }

        // Cập nhật thông tin cơ bản
        if (parsedInput.name !== undefined) user.name = parsedInput.name;
        if (parsedInput.status !== undefined) user.status = parsedInput.status;

        if (parsedInput.role) {
            user.roles = [];
            
            const roleDoc = await this.userRepository.findRoleByName(parsedInput.role);
            if (roleDoc) {
                // roleDoc từ repo trả về raw object, user.addRole cần object có id
                user.addRole({ id: roleDoc.id, name: roleDoc.name });
            } else {
                log.warn(`Role '${parsedInput.role}' not found, skipping`);
            }
        }

        const updatedUser = await this.userRepository.save(user);
        log.info("Task completed");

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            status: updatedUser.status,
            roles: updatedUser.roles,
        };
    }
}