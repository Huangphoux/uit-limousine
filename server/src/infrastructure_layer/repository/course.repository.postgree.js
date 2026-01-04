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

    // Don't filter by title at database level for case-insensitive search
    // We'll filter after fetching
    const searchTerm = title?.toLowerCase().trim();

    if (category && !title) {
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

    let result = await this.prisma.course.findMany({
      where,
      skip: searchTerm ? undefined : skip, // If searching, fetch all then paginate
      take: searchTerm ? undefined : take,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        // Include modules and lessons to calculate duration
        modules: {
          select: {
            lessons: {
              select: {
                durationSec: true,
              },
            },
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

    // Case-insensitive search filter (for SQLite compatibility)
    if (searchTerm) {
      result = result.filter((course) => {
        const titleMatch = course.title?.toLowerCase().includes(searchTerm);
        const descMatch = course.description?.toLowerCase().includes(searchTerm);
        const categoryMatch = course.category?.toLowerCase().includes(searchTerm);
        return titleMatch || descMatch || categoryMatch;
      });

      // Apply pagination after filtering
      if (skip !== undefined && take !== undefined) {
        result = result.slice(skip, skip + take);
      }
    }

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

      // Calculate total duration from lessons if explicit duration fields are not set
      let calculatedDurationHours = null;
      if (!course.durationWeeks && !course.durationDays && !course.durationHours) {
        const totalSec = (course.modules || []).reduce((sum, module) => {
          return (
            sum +
            (module.lessons || []).reduce((lessonSum, lesson) => {
              return lessonSum + (lesson.durationSec || 0);
            }, 0)
          );
        }, 0);

        if (totalSec > 0) {
          calculatedDurationHours = Math.round((totalSec / 3600) * 10) / 10; // Round to 1 decimal
        }
      }

      // Gán thêm thuộc tính động để UseCase có thể dùng
      return {
        ...courseEntity,
        isEnrolledByCurrentUser: course.enrollments?.length > 0,
        enrollmentCount: countMap.get(course.id) || 0,
        calculatedDurationHours,
      };
    });
  }

  /**
   * Count courses by filter
   */
  async countByFilter({ title, category, level, instructorId } = {}) {
    const where = {};

    // For search term, we need to fetch all and count in JavaScript (case-insensitive)
    const searchTerm = title?.toLowerCase().trim();

    // Exact match
    if (category && !searchTerm) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    } else {
      where.published = true;
    }

    // If no search term, use database count
    if (!searchTerm) {
      return await this.prisma.course.count({ where });
    }

    // Otherwise, fetch all and filter in JavaScript for case-insensitive search
    const allCourses = await this.prisma.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
      },
    });

    const filtered = allCourses.filter((course) => {
      const titleMatch = course.title?.toLowerCase().includes(searchTerm);
      const descMatch = course.description?.toLowerCase().includes(searchTerm);
      const categoryMatch = course.category?.toLowerCase().includes(searchTerm);
      return titleMatch || descMatch || categoryMatch;
    });

    return filtered.length;
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
    // Always use safe select to ensure modules are included
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

    if (!raw) {
      return null;
    }

    return CourseEntity.rehydrate(raw);
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
