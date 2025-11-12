import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class AssignmentRepository {
  async findById(id) {
    return await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true
      }
    });
  }
}