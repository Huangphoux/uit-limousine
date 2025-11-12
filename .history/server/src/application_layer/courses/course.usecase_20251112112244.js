import SubmissionRepository from '../../infrustructure_layer/repository/submission.repository.js';
import AssignmentRepository from '../../infrustructure_layer/repository/assignment.repository.js';
import EnrollmentRepository from '../../infrustructure_layer/repository/enrollment.repository.js';
import SubmissionEntity from '../../domain_layer/submission.entity.js';

export default class CourseUseCase {
  constructor() {
    this.submissionRepo = new SubmissionRepository();
    this.assignmentRepo = new AssignmentRepository();
    this.enrollmentRepo = new EnrollmentRepository();  
  }

  async submitAssignment(assignmentId, studentId, { content, fileUrl }) {
    console.log('[UseCase] submitAssignment called:', { assignmentId, studentId });

    
    const assignment = await this.assignmentRepo.findById(assignmentId);
    console.log('[UseCase] Assignment found:', assignment?.id);
    
    if (!assignment) {
      throw new Error('Assignment not found');
    }

  
    console.log('[UseCase] Checking enrollment for:', { 
      studentId, 
      courseId: assignment.courseId 
    });
    
    const enrollment = await this.enrollmentRepo.findByUserAndCourse(
      studentId,
      assignment.courseId
    );
    
    console.log('[UseCase] Enrollment:', enrollment?.status);
    
    if (!enrollment || enrollment.status !== 'ENROLLED') {
      throw new Error('You are not enrolled in this course');
    }

    
    const existingSubmission = await this.submissionRepo.findByAssignmentAndStudent(
      assignmentId,
      studentId
    );
    console.log('[UseCase] Existing submission:', existingSubmission?.id);
    
    if (existingSubmission) {
      throw new Error('You have already submitted this assignment');
    }

    // 4. Xác định status
    let status = 'SUBMITTED';
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      status = 'LATE';
    }
    console.log('[UseCase] Status:', status);

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
    console.log('[UseCase] Submission created:', newSubmission.id);
    
    return SubmissionEntity.fromPrisma(newSubmission);
  }
}