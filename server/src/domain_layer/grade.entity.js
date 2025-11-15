export default class GradeEntity {
  constructor(data) {
    this.submissionId = data.submissionId;
    this.graderId = data.graderId;
    this.grade = data.grade;
    this.feedback = data.feedback;
    this.gradedAt = data.gradedAt;
    this.maxPoints = data.maxPoints;
    this.studentId = data.studentId;
    this.assignmentId = data.assignmentId;
    this.courseId = data.courseId;
    
      }

  static fromSubmission(submission) {
        
    return new GradeEntity({
      submissionId: submission.id,
      graderId: submission.graderId,
      grade: submission.grade,
      feedback: submission.feedback,
      gradedAt: submission.gradedAt,
      maxPoints: submission.assignment?.maxPoints || 100,
      studentId: submission.studentId,
      assignmentId: submission.assignmentId,
      courseId: submission.assignment?.courseId
    });
  }

  isValidGrade() {
    const isValid = this.grade >= 0 && this.grade <= (this.maxPoints || 100);
        return isValid;
  }

  getPercentage() {
    const percentage = ((this.grade / (this.maxPoints || 100)) * 100).toFixed(2);
        return percentage;
  }
}