import z from "zod"

const lessonProgressSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    lessonId: z.string(),
    progress: z.number().default(0),
    completedAt: z.date().default(() => new Date()),
});


export class LessonProgressEntity {
    static schema = lessonProgressSchema;

    complete() {
        this.progress = 1.0;
        this.completedAt = new Date();
    }

    static create(input) {
        const parsedInput = LessonProgressEntity.schema.parse(input);

        // Business rules here

        return Object.assign(new LessonProgressEntity(), parsedInput);
    }

    static rehydrate(input) {
        if (!input) return null;
        return Object.assign(new LessonProgressEntity(), input);
    }
}
