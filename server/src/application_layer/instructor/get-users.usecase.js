import z from "zod"
import { logger } from "../../utils/logger.js";

export const inputSchema = z.object({
    authId: z.string(),
    page: z.coerce.number().int().min(1, { message: "Page must be at least 1" }).default(1),
    limit: z.coerce.number().int().min(1, { message: "Limit must be at least 1" }).default(10),
    role: z.string().optional(),
})

export const outputSchema = z.object({
    users: z.array(z.object({
        id: z.string(),
        username: z.string().nullable(),
    })),
    total: z.number().int().min(1),
    page: z.number().int().min(1).optional(),
    totalPages: z.number().int().min(1).optional(),
})

export class GetUsersUsecase {
    constructor(userReadAccessor) {
        this.userReadAccessor = userReadAccessor;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        logger.debug('Executing findUsers operation', {
            role: parsedInput.role,
            page: parsedInput.page,
            limit: parsedInput.limit,
        });

        try {
            const result = await this.userReadAccessor.findUsers({
                role: parsedInput.role,
                page: parsedInput.page,
                limit: parsedInput.limit,
                select: covertShemaToSelect(outputSchema.shape.users.element.shape),
            });

            logger.info('User search completed successfully', {
                role: parsedInput.role,
                total_users_found: result.total,
                page: parsedInput.page,
                limit: parsedInput.limit
            });

            const output = outputSchema.parse(result);
            output.page = parsedInput.page;
            output.totalPages = Math.ceil(output.total / parsedInput.limit);

            return output;
        }
        catch (error) {
            logger.error('Failed to execute findUsers command', {
                error_message: error.message,
                stack_trace: error.stack,
                input_role: parsedInput.role,
                input_page: parsedInput.page
            });
            throw error;
        }

        function covertShemaToSelect(schema) {
            return Object.keys(schema).reduce((select, key) => {
                select[key] = true;
                return select;
            }, {});
        }
    }

}