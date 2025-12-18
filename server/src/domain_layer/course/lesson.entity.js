import z from "zod";

export const lessonSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string().optional(),
  mediaUrl: z
    .union([z.string().url(), z.literal("")])
    .nullable()
    .optional(),
  contentType: z.enum(["video", "article", "file"]).optional(),
  durationSec: z.number().int().nullable().optional(),
  position: z.number().int().default(0),
  createdAt: z.date().default(() => new Date()),
});

export class LessonEntity {
  static schema = lessonSchema;

  static create(input) {
    const parsedInput = LessonEntity.schema.parse(input);

    // Business rules here

    return Object.assign(new LessonEntity(), parsedInput);
  }

  static rehydrate(input) {
    return Object.assign(new LessonEntity(), input);
  }
}
