import SubmissionRepository from '../../infrastructure_layer/repository/submission.repository.js';
import AssignmentRepository from '../../infrustructure_layer/repository/assignment.repository.js';
import EnrollmentRepository from '../../infrastructure_layer/repository/enrollment.repository.js';
import SubmissionEntity from '../../domain_layer/submission.entity.js';

export default class CourseUseCase {
  constructor() {
    this.submissionRepo = new SubmissionRepository();
    this.assignmentRepo = new AssignmentRepository();
    this.enrollmentRepo = new EnrollmentRepository();
  }

  async submitAssignment(assignmentId, studentId, { content, fileUrl }) {
    // 1. Kiểm tra assignment có tồn tại không
    const assignment = await this.assignmentRepo.findById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // 2. Kiểm tra student đã enroll course chưa
    const enrollment = await this.enrollmentRepo.findByUserAndCourse(
      studentId,
      assignment.courseId
    );
    if (!enrollment || enrollment.status !== 'ENROLLED') {
      throw new Error('You are not enrolled in this course');
    }

    // 3. Kiểm tra đã submit chưa (chỉ cho submit 1 lần)
    const existingSubmission = await this.submissionRepo.findByAssignmentAndStudent(
      assignmentId,
      studentId
    );
    if (existingSubmission) {
      throw new Error('You have already submitted this assignment');
    }

    // 4. Xác định status (SUBMITTED hoặc LATE)
    let status = 'SUBMITTED';
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      status = 'LATE';
    }

    // 5. Tạo submission
    const submissionData = {
      assignmentId,
      studentId,
      content: content || null,
      fileUrl: fileUrl || null,
      status,
      submittedAt: new Date()
    };

    const newSubmission = await this.submissionRepo.create(submissionData);
    return SubmissionEntity.fromPrisma(newSubmission);
  }

  async getSubmission(submissionId) {
    const submission = await this.submissionRepo.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return SubmissionEntity.fromPrisma(submission);
  }
}