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
                      dueDate: true,
                      maxPoints: true,
                    },
                  },
                  content: true,
                  durationSec: true,
                  position: true,
                  LessonProgress: {
                    where: { userId },
                    select: { progress: true },
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
                  durationSec: true,
                  position: true,
                  LessonProgress: {
                    where: { userId },
                    select: { progress: true },
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
                dueDate: l.assignment.dueDate,
                maxPoints: l.assignment.maxPoints,
              }
            : null,
          content: l.content,
          duration: l.durationSec,
          order: l.position,
          isCompleted: l.LessonProgress.some((p) => p.progress === 1),
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
}
