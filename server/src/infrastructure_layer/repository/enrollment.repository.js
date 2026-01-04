import prisma from "../../lib/prisma.js";

export default class EnrollmentRepository {
  async findByUserAndCourse(userId, courseId) {
    const result = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return result;
  }

  async add(entity) {
    return await prisma.enrollment.create({ data: entity });
  }

  async updateStatus(id, newStatus) {
    return await prisma.enrollment.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async updatePaid(id, isPaid) {
    return await prisma.enrollment.update({
      where: { id },
      data: { isPaid },
    });
  }
}
