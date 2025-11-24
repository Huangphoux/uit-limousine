import z from "zod";
import { logger } from "../../utils/logger.js";

const inputSchema = z.object({
    authId: z.string(),
    courseId: z.string(),
})

export const outputSchema = z.object({
    modules: z.array(z.object({
        id: z.string(),
        title: z.string(),
        order: z.number(),
        lessons: z.array(z.object({
            id: z.string(),
            title: z.string(),
            type: z.string().optional().nullable(),
            content: z.string().optional().nullable(),
            duration: z.number().optional().nullable(),
            order: z.number(),
            isCompleted: z.boolean(),
        }))
    }))
})

export class CourseMaterialsQueryUseCase {
    constructor(enrollmentReadAccessor, courseReadAccessor) {
        this.enrollmentReadAccessor = enrollmentReadAccessor;
        this.courseReadAccessor = courseReadAccessor;
    }

    async execute(input) {
        logger.debug("Executing Get Course Materials operation", input);
        const parsedInput = inputSchema.parse(input);

        const isPublished = await this.courseReadAccessor.isPublished(parsedInput.courseId);
        if (!isPublished) throw Error(`Course has not been published`);

        const enrolled = await this.enrollmentReadAccessor.isEnrolled(parsedInput.authId, parsedInput.courseId);
        if (!enrolled) throw Error(`User has not enrolled the course`);

        const courseMaterials = await this.courseReadAccessor.getCourseMaterials(parsedInput.courseId, parsedInput.authId);

        logger.debug("Finish Get Course Materials operation");
        return outputSchema.parse(courseMaterials);
    }
}