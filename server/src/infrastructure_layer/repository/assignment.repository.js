import prisma from "../../lib/prisma.js"; // ← ĐỔI IMPORT

export default class AssignmentRepository {
  async findById(id) {
    const result = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    return result;
  }

  async create(data) {
    const result = await prisma.assignment.create({
      data,
    });
    return result;
  }
  async update(id, data) {
    const result = await prisma.assignment.update({
      where: { id },
      data,
    });
    return result;
  }
}
