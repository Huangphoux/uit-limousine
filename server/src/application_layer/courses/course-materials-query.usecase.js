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
    constructor(courseRead, userRead) {
        this.courseRead = courseRead;
        this.userRead = userRead;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({
            task: "Getting course material",
            userId: parsedInput.authId,
            courseId: parsedInput.courseId,
        });
        log.info("Task started");

        const isPublished = await this.courseRead.isPublished(parsedInput.courseId);
        const isInstructor = await this.userRead.isInstructor(parsedInput.authId);
        if (!isPublished && !isInstructor) {
            log.warn("Task failed: unpublished course");
            throw Error(`Course has not been published`);
        }

        const courseMaterials = await this.courseRead.getCourseMaterials(parsedInput.courseId, parsedInput.authId);
        console.log(courseMaterials)

        log.info("Task completed");
        return outputSchema.parse(courseMaterials);
    }
}