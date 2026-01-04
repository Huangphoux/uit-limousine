import z from "zod";
import { LessonEntity, lessonSchema } from "./lesson.entity.js";

export const moduleSchema = z.object({
    id: z.string().optional(),
    courseId: z.string(),
    title: z.string(),
    position: z.number().int().default(0),
    createdAt: z.date().default(() => new Date()),
});

export class ModuleEntity {
    static schema = moduleSchema;

    static create(input) {
        const parsedInput = ModuleEntity.schema.parse(input);

        // Business rules here

        return Object.assign(new ModuleEntity(), parsedInput);
    }

    static rehydrate(input) {
        const entity = new ModuleEntity();

        Object.assign(entity, input);

        return entity;
    }

    rename(title) {
        if (!title)
            throw Error("Invalid module title");

        this.title = title;
    }

    reorder(position) {
        if (!position && position !== 0)
            throw Error("Invalid module position");

        this.position = position;
    }
}
