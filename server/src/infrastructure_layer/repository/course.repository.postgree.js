import { logger } from "../../utils/logger.js";
import { CourseEntity, courseSchema } from "../../domain_layer/course/course.entity.js";
import { toPersistence } from "../../domain_layer/domain_service/factory.js";
import { ModuleMapper } from "../mapper/module.mapper.js";
import { CourseMapper } from "../mapper/course.mapper.js";

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
  async findByFilter({ title, category, level, instructorId, skip, take, currentUserId }) {
    const where = {};

    if (title) {
      where.title = {
        contains: title,
      };
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    } else {
      // If not filtering by instructorId (i.e., learner view), only show published courses
      where.published = true;
    }
    console.log(currentUserId);

    const result = await this.prisma.course.findMany({
      where,
      skip,
      take,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        // --- THÊM LOGIC CHECK ENROLL Ở ĐÂY ---
        enrollments: currentUserId
          ? {
              where: {
                userId: currentUserId,
                status: "ENROLLED",
              },
              select: {
                id: true, // Chỉ cần lấy id để biết có tồn tại hay không
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Lấy tất cả enrollment count cho tất cả courses trong một query
    const enrollmentCounts = await this.prisma.enrollment.groupBy({
      by: ["courseId"],
      where: {
        courseId: { in: result.map((c) => c.id) },
        status: "ENROLLED",
      },
      _count: true,
    });

    // Tạo map từ courseId -> enrollment count
    const countMap = new Map(enrollmentCounts.map((item) => [item.courseId, item._count]));

    // Trả về dữ liệu đã được map thêm field isEnrolled
    // Luôn lấy tổng số enrolled students cho tất cả views
    return result.map((course) => {
      const courseEntity = CourseEntity.rehydrate(course);

      // Gán thêm thuộc tính động để UseCase có thể dùng
      return {
        ...courseEntity,
        isEnrolledByCurrentUser: course.enrollments?.length > 0,
        enrollmentCount: countMap.get(course.id) || 0,
      };
    });
  }

  /**
   * Count courses by filter
   */
  async countByFilter({ title, category, level, instructorId } = {}) {
    const where = {};

    // ❌ BỎ: published: true nếu muốn đếm tất cả
    // ✅ THÊM: published: true nếu chỉ muốn đếm courses đã publish
    // where.published = true; // Uncomment nếu cần

    // Partial match cho title
    if (title) {
      where.title = {
        contains: title,
      };
    }

    // Exact match
    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    return await this.prisma.course.count({ where });
  }

  async save(course) {
    // include relations (modules/lessons) when persisting
    const persistenceData = toPersistence(course, true);

    // Log to debug published field
    logger.debug("CourseRepository.save - persisting course", {
      courseId: course.id,
      published: course.published,
      persistenceData: JSON.stringify(persistenceData, null, 2),
    });

    // Delete all existing lessons for all modules before updating
    // This is necessary because Prisma doesn't support deleteMany inside nested upserts
    if (course.modules && course.modules.length > 0) {
      const moduleIds = course.modules.map((m) => m.id).filter(Boolean);
      if (moduleIds.length > 0) {
        const deletedCount = await this.prisma.lesson.deleteMany({
          where: {
            module: {
              id: { in: moduleIds },
            },
          },
        });
        logger.debug("Deleted existing lessons for modules", {
          moduleIds,
          deletedCount: deletedCount.count,
        });
      }
    }

    const raw = await this.prisma.course.update({
      where: { id: course.id },
      data: persistenceData,
    });

    logger.debug("CourseRepository.save - after update, fetching full result");

    // Fetch the saved course WITH all relations to verify what was actually saved
    const savedCourse = await this.prisma.course.findUnique({
      where: { id: course.id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    logger.debug("CourseRepository.save - verification fetch", {
      courseId: savedCourse.id,
      modulesCount: savedCourse.modules?.length,
      lessons: savedCourse.modules?.flatMap((m) =>
        m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          type: l.type,
          mediaUrl: l.mediaUrl,
          content: l.content?.substring(0, 50),
        }))
      ),
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

  // CourseRepository.js
  async updateApprovalStatus(courseId, { published, publishDate }) {
    return await this.prisma.course.update({
      where: { id: courseId },
      data: {
        published: published,
        publishDate: publishDate,
        // Nếu bạn muốn lưu lý do từ chối vào database,
        // bạn nên thêm field 'denialReason' vào model Course trong schema.prisma
      },
    });
  }

  async getById(id) {
    const raw = await this.prisma.course.findUnique({
      where: { id },
      select: CourseRepository.baseQuery,
    });

    return CourseEntity.rehydrate(raw);
  }

  async smartSave(course) {
    const existingModules = await this.prisma.module.findMany({
      where: { courseId: course.id },
      select: { id: true },
    });

    const existingModuleIds = existingModules.map((m) => m.id);
    const currentModuleIds = new Set(course.modules.map((m) => m.id).filter(Boolean));

    const deleteModuleIds = existingModuleIds.filter((id) => !currentModuleIds.has(id));
    const newModules = course.modules.filter((m) => !m.id);
    const updatedModules = course.modules.filter((m) => m.id);

    await this.prisma.$transaction([
      this.prisma.course.update({
        where: { id: course.id },
        data: CourseMapper.toPersistence(course),
      }),
      this.prisma.module.deleteMany({
        where: { id: { in: deleteModuleIds } },
      }),
      this.prisma.module.createMany({
        data: newModules.map(ModuleMapper.toPersistence),
      }),
      ...updatedModules.map((m) =>
        this.prisma.module.update({
          where: { id: m.id },
          data: ModuleMapper.toPersistence(m),
        })
      ),
    ]);
  }

  async atomicSave(entity) {
    const raw = await this.prisma.course.update({
      where: { id: entity.id },
      data: CourseMapper.toPersistence(entity),
      select: CourseRepository.baseQuery,
    });

    return CourseMapper.toDomain(entity);
  }

  static baseQuery = {
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
    category: true,
    durationWeeks: true,
    durationDays: true,
    durationHours: true,
    organization: true,
    requirement: true,
    createdAt: true,
    updatedAt: true,
    instructorId: true,
    modules: {
      select: {
        id: true,
        courseId: true,
        title: true,
        position: true,
      },
    },
  };
}
