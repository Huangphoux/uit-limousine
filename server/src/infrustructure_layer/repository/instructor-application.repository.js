import prisma from '../../lib/prisma.js';

export default class InstructorApplicationRepository {
  constructor() {
  }
  async create(applicationData) {
    

    try {
      const application = await prisma.instructorApplication.create({
        data: applicationData,
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      });

      

      return application;
    } catch (error) {
      console.error('[InstructorAppRepo]  Create error:', error.message);
      throw error;
    }
  }
  async findById(id) {
    try {
      const application = await prisma.instructorApplication.findUnique({
        where: { id },
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              bio: true
            }
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

     

      return application;
    } catch (error) {
      console.error('[InstructorAppRepo]  Find error:', error.message);
      throw error;
    }
  }
  async findPendingByApplicant(applicantId) {
    try {
      const application = await prisma.instructorApplication.findFirst({
        where: {
          applicantId,
          status: 'PENDING'
        }
      });

      
      return application;
    } catch (error) {
      console.error('[InstructorAppRepo]  Find pending error:', error.message);
      throw error;
    }
  }
  async approve(id, reviewerId, note) {
    try {
      const application = await prisma.instructorApplication.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewerId,
          reviewedAt: new Date(),
          note: note || null
        },
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

     

      return application;
    } catch (error) {
      console.error('[InstructorAppRepo]  Approve error:', error.message);
      throw error;
    }
  }
  async reject(id, reviewerId, note) {
    try {
      const application = await prisma.instructorApplication.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewerId,
          reviewedAt: new Date(),
          note: note || null
        },
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      console.log('[InstructorAppRepo]  Application rejected:', {
        id: application.id,
        applicantName: application.applicant?.name,
        reviewerName: application.reviewer?.name
      });

      return application;
    } catch (error) {
      console.error('[InstructorAppRepo]  Reject error:', error.message);
      throw error;
    }
  }
  async findAll(filters = {}) {
    try {
      const where = {};

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.applicantId) {
        where.applicantId = filters.applicantId;
      }

      const applications = await prisma.instructorApplication.findMany({
        where,
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          appliedAt: 'desc'
        }
      });
      return applications;
    } catch (error) {
      console.error('[InstructorAppRepo]  Find all error:', error.message);
      throw error;
    }
  }
  async assignInstructorRole(userId) {
    try {
      let instructorRole = await prisma.role.findFirst({
        where: { name: 'INSTRUCTOR' }
      });
      if (!instructorRole) {
        instructorRole = await prisma.role.create({
          data: {
            name: 'INSTRUCTOR',
            desc: 'Can create and manage courses'
          }
        });
      }
      const existingUserRole = await prisma.userRole.findFirst({
        where: {
          userId,
          roleId: instructorRole.id
        }
      });

      if (existingUserRole) {
        return existingUserRole;
      }
      const userRole = await prisma.userRole.create({
        data: {
          userId,
          roleId: instructorRole.id
        }
      });
      return userRole;
    } catch (error) {
      console.error('[InstructorAppRepo] Assign role error:', error.message);
      throw error;
    }
  }
}
