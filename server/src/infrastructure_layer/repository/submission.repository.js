import prisma from '../../lib/prisma.js';

export default class SubmissionRepository {
  async create(submissionData) {
    try {
      const result = await prisma.submission.create({
        data: {
          assignmentId: submissionData.assignmentId,
          studentId: submissionData.studentId,
          content: submissionData.content,
          fileUrl: submissionData.fileUrl,
          status: submissionData.status,
          submittedAt: submissionData.submittedAt
        },
        include: {
          assignment: true,
          student: {
            select: { id: true, name: true, email: true },
          },
        },
      });


      return result;
    } catch (error) {
      
      throw error('failed!');
    }
  }
n
  async findByAssignmentAndStudent(assignmentId, studentId) {
    const result = await prisma.submission.findFirst({
      where: {
        assignmentId,
        studentId,
      },
    });

    return result;
  }

  async findById(id) {
    return await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: true,
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findByAssignment(assignmentId, options = {}) {
    const where = { assignmentId };
    const result = await prisma.submission.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      include: {
        student: { select: { id: true, name: true, email: true } },
        assignment: true,
      },
    });
    return result;
  }
}
