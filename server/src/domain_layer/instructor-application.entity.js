export default class InstructorApplicationEntity {
  constructor(data) {
    this.id = data.id;
    this.applicantId = data.applicantId;
    this.requestedCourseTitle = data.requestedCourseTitle;
    this.requestedCourseSummary = data.requestedCourseSummary;
    this.portfolioUrl = data.portfolioUrl;
    this.status = data.status;
    this.note = data.note;
    this.appliedAt = data.appliedAt;
    this.reviewedAt = data.reviewedAt;
    this.reviewerId = data.reviewerId;
    
    
  }

  static fromPrisma(prismaApplication) {
    return new InstructorApplicationEntity(prismaApplication);
  }

  isPending() {
    return this.status === 'PENDING';
  }

  isApproved() {
    return this.status === 'APPROVED';
  }

  isRejected() {
    return this.status === 'REJECTED';
  }

  canBeReviewed() {
    const canReview = this.status === 'PENDING';
    return canReview;
  }
}