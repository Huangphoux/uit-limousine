import z, { email } from "zod"
import { logger } from "../../utils/logger.js";

export const inputSchema = z.object({
    authId: z.string(),
    page: z.coerce.number().int().min(1, { message: "Page must be at least 1" }).default(1),
    limit: z.coerce.number().int().min(1, { message: "Limit must be at least 1" }).default(10),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    // role: z.string().optional(),
    // email: z.string().email().optional(),

})

export const outputSchema = z.object({
    users: z.array(z.object({
        id: z.string(),
        name: z.string().nullable(),
        roles: z.array(z.any()).optional(),
        email: z.string().email(),
        status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
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
        const log = logger.child({
            task: "Getting users",
            adminId: parsedInput.authId,
        });
        log.info("Task started");

        try {
            const result = await this.userReadAccessor.findUsers({
                role: parsedInput.role,
                page: parsedInput.page,
                status: parsedInput.status,
                limit: parsedInput.limit,
                select: covertShemaToSelect(outputSchema.shape.users.element.shape),
            });

            const output = outputSchema.parse(result);
            output.page = parsedInput.page;
            output.totalPages = Math.ceil(output.total / parsedInput.limit);

            log.info("Task completed");
            return output;
        }
        catch (error) {
            logger.error('Task failed', {
                error_message: error.message,
                stack_trace: error.stack,
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