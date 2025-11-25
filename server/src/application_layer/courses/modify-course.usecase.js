import z from "zod"
import { AuditLog } from "../../domain_layer/audit-log.entity.js";
import { logger } from "../../utils/logger.js";

export const modifiedCourseDataSchema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number()
})

export const inputSchema = modifiedCourseDataSchema.merge(z.object({
    authId: z.string(),
    id: z.string(),
}))

export const outputSchema = z.object({
    id: z.string(),
    title: z.string(),
    updatedAt: z.date(),
})

export class ModifyCourseUsecase {
    constructor(courseRepository, auditLogRepository) {
        this.courseRepository = courseRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async execute(input) {
        logger.debug("Executing Modify course operation", input);
        const parsedInput = inputSchema.parse(input);

        const course = await this.courseRepository.findById(parsedInput.id);
        if (!course) throw Error(`Course not found, ${parsedInput.id}`);

        if (course.instructorId !== parsedInput.authId)
            throw Error(`Unauthorized instructor, ${parsedInput.authId}`);

        const oldCourseData = modifiedCourseDataSchema.parse(course);

        course.updateTitle(parsedInput.title);
        course.updateDescription(parsedInput.description);
        course.updatePrice(parsedInput.price);

        const savedCourse = await this.courseRepository.save(course);

        const auditLog = AuditLog.create({
            actorId: savedCourse.instructorId,
            action: "update",
            resource: "course",
            resourceId: savedCourse.id,
            data: {
                before: oldCourseData,
                after: modifiedCourseDataSchema.parse(savedCourse),
            }
        });

        const savedLog = await this.auditLogRepository.add(auditLog);

        logger.debug("Finish Modify course operation");
        return outputSchema.parse(savedCourse);
    }
}