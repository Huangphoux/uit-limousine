import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class AssignmentRepository {
  async findById(id) {
    console.log('[AssignmentRepo] Finding assignment:', id);
    
    const result = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true
      }
    });
    
    console.log('[AssignmentRepo] Found:', result?.id || 'null');
    return result;
  }
}
