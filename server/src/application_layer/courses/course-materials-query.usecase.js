import z from "zod";
import { logger } from "../../utils/logger.js";

const inputSchema = z.object({
  authId: z.string(),
  courseId: z.string(),
});

export const outputSchema = z.object({
  modules: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      lessons: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          type: z.string().optional().nullable(),
          content: z.string().optional().nullable(),
          duration: z.number().optional().nullable(),
          order: z.number(),
          isCompleted: z.boolean(),
          assignmentId: z.string().optional().nullable(),
          assignment: z
            .object({
              id: z.string(),
              title: z.string().optional().nullable(),
              description: z.string().optional().nullable(),
              dueDate: z.date().optional().nullable(),
              maxPoints: z.number().optional().nullable(),
            })
            .optional()
            .nullable(),
        })
      ),
    })
  ),
});

export class CourseMaterialsQueryUseCase {
  constructor(courseRead, enrollmentRead) {
    this.courseRead = courseRead;
    this.enrollmentRead = enrollmentRead;
  }

  async execute(input) {
    const parsedInput = inputSchema.parse(input);
    const log = logger.child({
      task: "Getting course material",
      userId: parsedInput.authId,
      courseId: parsedInput.courseId,
    });
    log.info("Task started");

    // Check if user is the instructor of this course
    const isInstructor = await this.courseRead.isInstructor(
      parsedInput.courseId,
      parsedInput.authId
    );

    // If not instructor, check published and enrollment
    if (!isInstructor) {
      const isPublished = await this.courseRead.isPublished(parsedInput.courseId);
      if (!isPublished) {
        log.warn("Task failed: unpublished course");
        throw Error(`Course has not been published`);
      }

      const enrolled = await this.enrollmentRead.isEnrolled(
        parsedInput.authId,
        parsedInput.courseId
      );
      if (!enrolled) {
        log.warn("Task failed: unenrolled course");
        throw Error(`User has not enrolled the course`);
      }
    }

    const courseMaterials = await this.courseRead.getCourseMaterials(
      parsedInput.courseId,
      parsedInput.authId
    );

    log.info("Task completed");
    return outputSchema.parse(courseMaterials);
  }
}
