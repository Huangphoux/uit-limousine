import prisma from '../../lib/prisma.js';

export default class EnrollmentRepository {
  
  async findByUserAndCourse(userId, courseId) {
  
    const result = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
    
    return result;
  }
}