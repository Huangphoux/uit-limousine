import z from "zod";
import { AuditLog } from "../../domain_layer/audit-log.entity.js";
import { logger } from "../../utils/logger.js";
import { moduleSchema } from "../../domain_layer/course/module.entity.js";

// Schema for audit log - simpler version without complex nested structures
const auditCourseDataSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  level: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
});

export const modifiedCourseDataSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  level: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  modules: z.array(moduleSchema).optional(),
});

export const inputSchema = modifiedCourseDataSchema.merge(
  z.object({
    authId: z.string(),
    id: z.string(),
  })
);

export const outputSchema = z.object({
  id: z.string(),
  title: z.string(),
  updatedAt: z.date(),
});

export class ModifyCourseUsecase {
  constructor(courseRepository, auditLogRepository) {
    this.courseRepository = courseRepository;
    this.auditLogRepository = auditLogRepository;
  }

  async execute(input) {
    const parsedInput = inputSchema.parse(input);
    const log = logger.child({
      task: "Modifying course",
      instructorId: parsedInput.authId,
      courseId: parsedInput.id,
    });
    log.info("Task started");

    const course = await this.courseRepository.findById(parsedInput.id);
    if (!course) {
      log.warn("Task failed: invalid course id");
      throw Error(`Course not found, ${parsedInput.id}`);
    }

    if (course.instructorId !== parsedInput.authId) {
      log.warn("Task failed: unauthorized instructor id");
      throw Error(`Unauthorized instructor, ${parsedInput.authId}`);
    }

    // Capture old data for audit log (without modules to avoid Date serialization issues)
    const oldCourseData = auditCourseDataSchema.parse({
      title: course.title,
      description: course.description,
      price: course.price,
      level: course.level,
      language: course.language,
      coverImage: course.coverImage,
    });

    course.updateTitle(parsedInput.title);
    if (parsedInput.description !== undefined) {
      course.updateDescription(parsedInput.description);
    }
    course.updatePrice(parsedInput.price);
    if (parsedInput.level !== undefined) {
      course.updateLevel(parsedInput.level);
    }
    if (parsedInput.language !== undefined) {
      course.updateLanguage(parsedInput.language);
    }
    if (parsedInput.coverImage !== undefined) {
      course.updateCoverImage(parsedInput.coverImage);
    }
    if (parsedInput.modules !== undefined) {
      course.updateModules(parsedInput.modules);
    }

    const savedCourse = await this.courseRepository.save(course);

    // Audit log with only basic fields (excluding modules for simplicity)
    const auditLog = AuditLog.create({
      actorId: savedCourse.instructorId,
      action: "update",
      resource: "course",
      resourceId: savedCourse.id,
      data: {
        before: oldCourseData,
        after: auditCourseDataSchema.parse({
          title: savedCourse.title,
          description: savedCourse.description,
          price: savedCourse.price,
          level: savedCourse.level,
          language: savedCourse.language,
          coverImage: savedCourse.coverImage,
        }),
      },
    });

    const savedLog = await this.auditLogRepository.add(auditLog);

    log.info("Task completed");
    return outputSchema.parse(savedCourse);
  }
}
