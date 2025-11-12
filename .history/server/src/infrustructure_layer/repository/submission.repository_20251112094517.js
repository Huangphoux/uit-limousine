import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class SubmissionRepository {
  async create(submissionData) {
    return await prisma.submission.create({
      data: submissionData,
      include: {
        assignment: true,
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async findByAssignmentAndStudent(assignmentId, studentId) {
    return await prisma.submission.findFirst({
      where: {
        assignmentId,
        studentId
      }
    });
  }

  async findById(id) {
    return await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: true,
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }
}