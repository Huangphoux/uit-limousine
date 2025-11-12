import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class EnrollmentRepository {
  async findByUserAndCourse(userId, courseId) {
    return await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
  }
}