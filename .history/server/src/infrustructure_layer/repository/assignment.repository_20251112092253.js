const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AssignmentRepository {
  async findById(id) {
    return await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true
      }
    });
  }
}

module.exports = AssignmentRepository;