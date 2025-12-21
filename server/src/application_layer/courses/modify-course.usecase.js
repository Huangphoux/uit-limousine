import z from "zod";
import { AuditLog } from "../../domain_layer/audit-log.entity.js";
import { logger } from "../../utils/logger.js";
import { moduleSchema } from "../../domain_layer/course/module.entity.js";
import AssignmentRepository from "../../infrastructure_layer/repository/assignment.repository.js";

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
  published: z.boolean().optional(),
});

export const inputSchema = modifiedCourseDataSchema
  .merge(
    z.object({
      authId: z.string(),
      id: z.string().optional(),
      courseId: z.string().optional(),
    })
  )
  .transform((data) => {
    // Map courseId to id if id is not provided
    if (!data.id && data.courseId) {
      data.id = data.courseId;
    }
    return data;
  });

export const outputSchema = z.object({
  id: z.string(),
  title: z.string(),
  updatedAt: z.date(),
});

export class ModifyCourseUsecase {
  constructor(courseRepository, auditLogRepository) {
    this.courseRepository = courseRepository;
    this.auditLogRepository = auditLogRepository;
    this.assignmentRepository = new AssignmentRepository();
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
    if (parsedInput.published !== undefined) {
      course.published = parsedInput.published;
      if (parsedInput.published && !course.publishDate) {
        course.publishDate = new Date();
      }
    }
    if (parsedInput.modules !== undefined) {
      // Debug: Log modules before processing
      console.log(
        "[ModifyCourse] parsedInput.modules:",
        JSON.stringify(parsedInput.modules, null, 2)
      );

      // Create Assignment entities for lessons marked as assignment but missing assignmentId
      for (const module of parsedInput.modules) {
        if (!module.lessons || !Array.isArray(module.lessons)) continue;
        for (const lesson of module.lessons) {
          try {
            const ct = (lesson.contentType || lesson.type || "").toLowerCase();
            if (ct === "assignment" && !lesson.assignmentId) {
              // Build payload from available lesson fields
              const assignPayload = {
                courseId: parsedInput.id,
                title: lesson.title || "Assignment",
                description: lesson.content || lesson.description || null,
                dueDate: lesson.dueDate ? new Date(lesson.dueDate) : null,
                maxPoints: lesson.maxPoints || lesson.maxScore || 100,
              };

              const created = await this.assignmentRepository.create(assignPayload);
              if (created && created.id) {
                lesson.assignmentId = created.id;
                // ensure contentType is assignment
                lesson.contentType = "assignment";
              }
            }
          } catch (e) {
            // log and continue — don't fail entire update for one assignment creation
            logger.warn("Failed to create assignment for lesson", {
              lessonTitle: lesson.title,
              error: e.message,
            });
          }
        }
      }

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
