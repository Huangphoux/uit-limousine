innerHeightmport prisma from '../../lib/prisma.js';

export default class EnrollmentRepository {
  async findByUserAndCourse(userId, courseId) {
    console.log('[EnrollmentRepo] Finding enrollment:', { userId, courseId });
    
    try {
      const result = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });
      
      console.log('[EnrollmentRepo] Found:', result?.id || 'null', 'Status:', result?.status);
      return result;
    } catch (error) {
      console.error('[EnrollmentRepo] Error:', error.message);
      throw error;
    }
  }
}s