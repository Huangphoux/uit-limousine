class SubmissionEntity {
  constructor(data) {
    this.id = data.id;
    this.assignmentId = data.assignmentId;
    this.studentId = data.studentId;
    this.content = data.content;
    this.fileUrl = data.fileUrl;
    this.status = data.status;
    this.grade = data.grade;
    this.feedback = data.feedback;
    this.submittedAt = data.submittedAt;
    this.gradedAt = data.gradedAt;
    this.graderId = data.graderId;
  }

  static fromPrisma(prismaSubmission) {
    return new SubmissionEntity(prismaSubmission);
  }
}