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
    console.log('[UseCase] Status:', status);

    
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