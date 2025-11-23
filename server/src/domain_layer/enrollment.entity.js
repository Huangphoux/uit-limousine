import { z } from "zod";

export const enrollmentStatusEnum = z.enum([
    "ENROLLED",
    "PENDING",
    "COMPLETED",
    "CANCELLED",
]);

export const enrollmentSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    courseId: z.string(),
    status: enrollmentStatusEnum.default("ENROLLED"),
    isPaid: z.boolean().default(false),
    enrolledAt: z.date().default(() => new Date()),
    completedAt: z.date().nullable().optional(),
});

export class EnrollmentEntity {
    static schema = enrollmentSchema;

    static create(input) {
        const parsedInput = EnrollmentEntity.schema.parse(input);

        // Business rules here

        return Object.assign(new EnrollmentEntity(), parsedInput);
    }
}
