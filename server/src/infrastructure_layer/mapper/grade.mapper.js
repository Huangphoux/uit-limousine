export default class GradeMapper {
  static toDTO(gradeEntity, submission) {
    
    const dto = {
      submissionId: gradeEntity.submissionId,
      assignmentId: gradeEntity.assignmentId,
      grade: gradeEntity.grade,
      maxPoints: gradeEntity.maxPoints,
      percentage: gradeEntity.getPercentage(),
      feedback: gradeEntity.feedback,
      gradedAt: gradeEntity.gradedAt,
      gradedBy: submission?.grader ? {
        id: submission.grader.id,
        name: submission.grader.name,
        email: submission.grader.email
      } : null,
      student: submission?.student ? {
        id: submission.student.id,
        name: submission.student.name,
        email: submission.student.email
      } : null,
      assignment: submission?.assignment ? {
        id: submission.assignment.id,
        title: submission.assignment.title,
        maxPoints: submission.assignment.maxPoints
      } : null,
      status: 'GRADED'
    };

    
    return dto;
  }
}