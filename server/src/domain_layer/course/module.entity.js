import z from "zod";
import { LessonEntity, lessonSchema } from "./lesson.entity.js";

export const moduleSchema = z.object({
    id: z.string().optional(),
    courseId: z.string(),
    title: z.string(),
    position: z.number().int().default(0),
    createdAt: z.date().default(() => new Date()),
    lessons: z.array(lessonSchema).optional(),
});

export class ModuleEntity {
    static schema = moduleSchema;

    static create(input) {
        const parsedInput = ModuleEntity.schema.parse(input);

        // Business rules here

        return Object.assign(new EnrollmentEntity(), parsedInput);
    }

    static rehydrate(input) {
        const entity = new ModuleEntity();

        if (input.lessons) {
            entity.lessons = input.lessons.map(LessonEntity.rehydrate);
        }

        Object.assign(entity, { ...input, lessons: entity.lessons });

        return entity;
    }
}
