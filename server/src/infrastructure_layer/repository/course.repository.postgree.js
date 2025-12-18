import { logger } from "../../utils/logger.js";
import { CourseEntity, courseSchema } from "../../domain_layer/course/course.entity.js";
import { buildQuery } from "../../utils/query-builder.js";
import { toPersistence } from "../../domain_layer/domain_service/factory.js";

export class CourseRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findById(id) {
    try {
      const raw = await this.prisma.course.findUnique({
        where: { id: id },
        select: CourseRepository.baseQuery,
      });

      return CourseEntity.rehydrate(raw);
    } catch (err) {
      // Fallback for databases that haven't been migrated to include assignment fields
      console.warn(
        "CourseRepository.findById: baseQuery select failed, retrying with safe select",
        err.message
      );
      const raw = await this.prisma.course.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          shortDesc: true,
          description: true,
          language: true,
          level: true,
          price: true,
          published: true,
          publishDate: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
          instructorId: true,
          modules: {
            select: {
              id: true,
              title: true,
              position: true,
              createdAt: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  content: true,
                  mediaUrl: true,
                  contentType: true,
                  durationSec: true,
                  position: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });

      return CourseEntity.rehydrate(raw);
    }
  }

  async findByFilter({ title, category, level, skip, take }) {
    const where = {};
    if (title) where.title = title;
    if (category) where.category = category;
    if (level) where.level = level;
    // allow filtering by instructorId when provided
    if (arguments[0] && arguments[0].instructorId) where.instructorId = arguments[0].instructorId;

    const result = await this.prisma.course.findMany({
      where,
      skip,
      take,
      include: { instructor: true },
    });

    return result.map(CourseEntity.rehydrate);
  }

  async save(course) {
    // include relations (modules/lessons) when persisting
    const raw = await this.prisma.course.update({
      where: { id: course.id },
      data: toPersistence(course, true),
    });

    return CourseEntity.rehydrate(raw);
  }

  async add(course) {
    // include relations (modules/lessons) when creating
    const persistenceData = toPersistence(course, true);

    logger.debug("Creating course in DB", {
      courseId: course.id,
      instructorId: course.instructorId,
      payload: persistenceData,
    });

    try {
      const raw = await this.prisma.course.create({ data: persistenceData });

      logger.info("Course created", {
        courseId: raw.id,
        instructorId: raw.instructorId,
      });

      console.log(raw);

      return CourseEntity.rehydrate(raw);
    } catch (error) {
      logger.error("Course creation failed", {
        error_message: error.message,
        stack_trace: error.stack,
        courseId: course.id,
        instructorId: course.instructorId,
        payload: persistenceData,
      });

      throw error;
    }
  }

  async findByLessonId(lessonId) {
    try {
      const raw = await this.prisma.course.findFirst({
        where: {
          modules: {
            some: {
              lessons: {
                some: {
                  id: lessonId,
                },
              },
            },
          },
        },
        select: CourseRepository.baseQuery,
      });

      return CourseEntity.rehydrate(raw);
    } catch (err) {
      console.warn(
        "CourseRepository.findByLessonId: baseQuery select failed, retrying with safe select",
        err.message
      );
      const raw = await this.prisma.course.findFirst({
        where: {
          modules: {
            some: {
              lessons: {
                some: {
                  id: lessonId,
                },
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
          shortDesc: true,
          description: true,
          language: true,
          level: true,
          price: true,
          published: true,
          publishDate: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
          instructorId: true,
          modules: {
            select: {
              id: true,
              title: true,
              position: true,
              createdAt: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  content: true,
                  mediaUrl: true,
                  contentType: true,
                  durationSec: true,
                  position: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });

      return CourseEntity.rehydrate(raw);
    }
  }

  static baseQuery = buildQuery(courseSchema);
}
