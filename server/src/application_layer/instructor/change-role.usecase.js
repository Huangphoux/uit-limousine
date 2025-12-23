import z from "zod"
import { logger } from "../../utils/logger.js";

export const inputSchema = z.object({
    authId: z.string(),
    id: z.string(),
    role: z.string(),
})

export const outputSchema = z.object({
    id: z.string(),
    roles: z.array(z.string()),
});

export class ChangeRoleUsecase {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({
            task: "Changing role",
            adminId: parsedInput.authId,
            userId: parsedInput.id,
        });
        log.info("Task started");

        const user = await this.userRepository.findById(parsedInput.id);
        if (!user) {
            log.warn("Task failed: invalid user id");
            throw Error(`User not found, ${parsedInput.id}`);
        }

        const role = await this.roleRepository.findByName(parsedInput.role);
        if (!role) {
            log.warn("Task failed: invalid role");
            throw Error(`Role not found, ${parsedInput.role}`);
        }

        user.addRole(role);

        const result = await this.userRepository.save(user);

        log.info("Task completed");
        return outputSchema.parse({
            id: result.id,
            roles: result.roles.map(r => r.name),
        });
    }
}