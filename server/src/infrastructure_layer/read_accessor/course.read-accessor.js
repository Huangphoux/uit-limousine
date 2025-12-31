import { id } from "zod/v4/locales";

export class CourseReadAccessor {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getCourseMaterials(courseId, userId) {
    let raw;
    try {
      raw = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: {
          modules: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                orderBy: { position: "asc" },
                select: {
                  id: true,
                  title: true,
                  contentType: true,
                  assignmentId: true,
                  assignment: {
                    select: {
                      id: true,
                      title: true,
                      description: true,
                      dueDate: true,
                      maxPoints: true,
                    },
                  },
                  content: true,
                  mediaUrl: true,
                  durationSec: true,
                  position: true,
                  LessonProgress: {
                    where: { userId },
                    select: { progress: true },
                  },
                  lessonResources: {
                    select: {
                      id: true,
                      lessonId: true,
                      filename: true,
                      mimeType: true,
                    }
                  },
                },
              },
            },
          },
        },
      });
    } catch (e) {
      // Fallback for databases that don't yet have assignmentId/assignment fields
      console.warn(
        "CourseReadAccessor: extended lesson select failed, retrying without assignment fields",
        e.message
      );
      raw = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: {
          modules: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                orderBy: { position: "asc" },
                select: {
                  id: true,
                  title: true,
                  contentType: true,
                  content: true,
                  mediaUrl: true,
                  durationSec: true,
                  position: true,
                  LessonProgress: {
                    where: { userId },
                    select: { progress: true },
                  },
                  lessonResources: {
                    select: {
                      id: true,
                      lessonId: true,
                      filename: true,
                      mimeType: true,
                    }
                  },
                },
              },
            },
          },
        },
      });
    }

    return {
      modules: raw.modules.map((m) => ({
        id: m.id,
        title: m.title,
        order: m.position,
        lessons: m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          type: l.contentType,
          assignmentId: l.assignmentId || null,
          assignment: l.assignment
            ? {
              id: l.assignment.id,
              title: l.assignment.title,
              description: l.assignment.description,
              dueDate: l.assignment.dueDate,
              maxPoints: l.assignment.maxPoints,
            }
            : null,
          content: l.content,
          mediaUrl: l.mediaUrl,
          duration: l.durationSec,
          order: l.position,
          isCompleted: l.LessonProgress.some((p) => p.progress === 1),
          lessonResources: l.lessonResources,
        })),
      })),
    };
  }

  async isPublished(id) {
    const count = await this.prisma.course.count({
      where: { id, published: true },
    });

    return count == 1;
  }

  async isInstructor(courseId, userId) {
    const count = await this.prisma.course.count({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    return count == 1;
  }
}
