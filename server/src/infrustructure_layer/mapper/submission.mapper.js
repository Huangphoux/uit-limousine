export default class SubmissionMapper {
  static toDTO(submissionEntity) {
    return {
      id: submissionEntity.id,
      assignmentId: submissionEntity.assignmentId,
      studentId: submissionEntity.studentId,
      content: submissionEntity.content,
      fileUrl: submissionEntity.fileUrl,
      status: submissionEntity.status,
      grade: submissionEntity.grade,
      feedback: submissionEntity.feedback,
      submittedAt: submissionEntity.submittedAt,
      gradedAt: submissionEntity.gradedAt,
      assignment: submissionEntity.assignment,
      student: submissionEntity.student
    };
  }
}