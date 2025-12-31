import z from "zod";

const urlSchema = z.string().url().nullable().optional();
const durationSecSchema = z.number().int().nullable().optional();
const positionSchema = z.number().int().default(0);

export const lessonSchema = z.object({
  id: z.string().optional(),
  moduleId: z.string(),
  title: z.string(),
  content: z.string().optional(),
  contentType: z.string(),
  mediaUrl: urlSchema,
  assignmentId: z.string().nullable().optional(),
  durationSec: durationSecSchema,
  position: positionSchema,
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
    // Parse through schema to ensure all optional fields are handled correctly
    const parsedInput = LessonEntity.schema.parse(input);
    return Object.assign(new LessonEntity(), parsedInput);
  }

  rename(title) {
    if (!title)
      throw Error("Invalid lesson title");

    this.title = title;
  }

  changeMediaUrl(mediaUrl) {
    this.mediaUrl = urlSchema.parse(mediaUrl);
  }

  modifyContent(content) {
    this.content = lessonSchema.shape.content.parse(content);
  }

  changeContentType(contentType) {
    this.contentType = lessonSchema.shape.contentType.parse(contentType);
  }

  setLessonDuration(durationSec) {
    this.durationSec = durationSecSchema.parse(durationSec);
  }

  reorder(position) {
    this.position = positionSchema.parse(position);
  }

  changeAssignment(assignmentId) {
    this.assignmentId = LessonEntity.schema.shape.assignmentId.parse(assignmentId);
  }
}
