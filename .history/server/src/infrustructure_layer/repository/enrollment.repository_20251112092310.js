const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EnrollmentRepository {
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

module.exports = EnrollmentRepository;