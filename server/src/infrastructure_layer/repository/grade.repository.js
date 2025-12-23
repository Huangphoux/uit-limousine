import prisma from '../../lib/prisma.js';

export default class GradeRepository {
  constructor() {
      }
  async getSubmissionForGrading(submissionId) {
        
    try {
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          assignment: {
            include: {
              course: {
                include: {
                  instructor: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          grader: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      

      return submission;
    } catch (error) {
            throw new Error("get submission for grading!");
    }
  }
  async saveGrade(submissionId, gradeData) {
            
    try {
      const updatedSubmission = await prisma.submission.update({
        where: { id: submissionId },
        data: {
          grade: gradeData.grade,
          feedback: gradeData.feedback,
          status: 'GRADED',
          gradedAt: new Date(),
          graderId: gradeData.graderId
        },
        include: {
          assignment: {
            include: {
              course: true
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          grader: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      
      return updatedSubmission;
    } catch (error) {
            throw new Error("Failed to save grade!");
    }
  }
  async verifyInstructorPermission(graderId, courseId) {
            
    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          title: true,
          instructorId: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!course) {
                return { isAuthorized: false, course: null };
      }

      const isAuthorized = course.instructorId === graderId;

      
      return { isAuthorized, course };
    } catch (error) {
            throw new Error("Failed to verify permission!");
    }
  }
}
