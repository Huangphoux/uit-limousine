import prisma from '../../../prisma/client.js';

export class CourseRepositoryPostgree {
  static async getAllCourses() {
    return prisma.course.findMany({
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } }
      }
    });
  }

  static async getCourseById(courseId) {
    return prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        modules: {
          include: {
            lessons: {
              select: { id: true, title: true, contentType: true, position: true, durationSec: true }
            }
          }
        },
        enrollments: { select: { id: true, userId: true, status: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } }
          }
        }
      }
    });
  }
}