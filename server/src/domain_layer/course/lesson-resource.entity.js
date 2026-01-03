import z from "zod";

export const lessonResourceSchema = z.object({
    id: z.string().optional(),
    lessonId: z.string(),
    fileId: z.string(),
    filename: z.string(),
    mimeType: z.string(),
    createdAt: z.date().default(() => new Date()),
});

export class LessonResourceEntity {
    static schema = lessonResourceSchema;

    static create(input) {
        const parsedInput = LessonResourceEntity.schema.parse(input);

        // Business rules here

        return Object.assign(new LessonResourceEntity(), parsedInput);
    }

    static rehydrate(input) {
        // Parse through schema to ensure all optional fields are handled correctly
        const parsedInput = LessonResourceEntity.schema.parse(input);
        return Object.assign(new LessonResourceEntity(), parsedInput);
    }

    changeFile(fileId, filename, mimeType) {
        this.fileId = fileId;
        this.filename = filename;
        this.mimeType = mimeType;
    }
}