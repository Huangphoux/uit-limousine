import SubmissionRepository from '../../infrastructure_layer/repository/submission.repository.js';
import AssignmentRepository from '../../infrastructure_layer/repository/assignment.repository.js';
import EnrollmentRepository from '../../infrastructure_layer/repository/enrollment.repository.js';
import SubmissionEntity from '../../domain_layer/submission.entity.js';

export default class CourseUseCase {
  constructor() {
    this.submissionRepo = new SubmissionRepository();
    this.assignmentRepo = new AssignmentRepository();
    this.enrollmentRepo = new EnrollmentRepository();
  }

  async submitAssignment(assignmentId, studentId, fileInfo) {
    const assignment = await this.assignmentRepo.findById(assignmentId);

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const enrollment = await this.enrollmentRepo.findByUserAndCourse(
      studentId,
      assignment.courseId
    );

    if (!enrollment || enrollment.status !== 'ENROLLED') {
      throw new Error('You are not enrolled in this course');
    }

    const existingSubmission = await this.submissionRepo.findByAssignmentAndStudent(
      assignmentId,
      studentId
    );

    if (existingSubmission) {
      throw new Error('You have already submitted this assignment');
    }

    let status = 'SUBMITTED';
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      status = 'LATE';
    }

    const submissionData = {
      assignmentId,
      studentId,
      content: fileInfo.content || null,
      fileUrl: fileInfo.fileUrl || null,
      status,
      submittedAt: new Date()
    };

    const newSubmission = await this.submissionRepo.create(submissionData);

    return SubmissionEntity.fromPrisma(newSubmission);
  }
}