import prisma from '../../lib/prisma.js'; // ← ĐỔI IMPORT

export default class AssignmentRepository {
  async findById(id) {
    
    const result = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true
      }
    });
    
    return result;
  }
}
