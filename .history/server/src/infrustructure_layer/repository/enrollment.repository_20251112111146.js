import prisma from '../../lib/prisma.js';

export default class EnrollmentRepository {
  // ✅ ĐẢM BẢO TÊN METHOD ĐÚNG: findByUserAndCourse
  async findByUserAndCourse(userId, courseId) {
    console.log('[EnrollmentRepo] Finding enrollment:', { userId, courseId });
    
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
  }
}