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
        logger.debug('Executing change role operation', {
            id: parsedInput.id,
            role: parsedInput.role,
            correlationId: parsedInput.authId,
        });

        const user = await this.userRepository.findById(parsedInput.id);
        if (!user) throw Error(`User not found, ${parsedInput.id}`);

        const role = await this.roleRepository.findByName(parsedInput.role);
        if (!role) throw Error(`Role not found, ${parsedInput.role}`);

        user.addRole(role);

        try {
            const result = await this.userRepository.save(user);

            logger.info('Change role completed successfully', {
                id: result.id,
                role: role.name,
                correlationId: parsedInput.authId,
            });

            return outputSchema.parse({
                id: result.id,
                roles: result.roles.map(r => r.name),
            });
        }
        catch (error) {
            logger.error('Failed to execute change role command', {
                error_message: error.message,
                stack_trace: error.stack,
                input_id: parsedInput.id,
                input_role: parsedInput.role,
                correlationId: parsedInput.authId,
            });
            throw error;
        }
    }
}