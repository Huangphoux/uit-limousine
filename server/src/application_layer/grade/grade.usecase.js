import GradeRepository from '../../infrastructure_layer/repository/grade.repository.js';
import GradeEntity from '../../domain_layer/grade.entity.js';

export default class GradeUseCase {
  constructor() {
    this.gradeRepo = new GradeRepository();
  }

  async executeGrading(submissionId, graderId, gradeData) {
   

    try {
     
      const submission = await this.gradeRepo.getSubmissionForGrading(submissionId);

      if (!submission) {
        throw new Error('Submission not found');
      }
     
      
      if (submission.status === 'GRADED') {
       
        throw new Error('Submission has already been graded');
      }
      const courseId = submission.assignment?.courseId;

      if (!courseId) {
        throw new Error('Course information missing');
      }

      const { isAuthorized, course } = await this.gradeRepo.verifyInstructorPermission(
        graderId,
        courseId
      );

      if (!isAuthorized) {
      
        throw new Error('Only the course instructor can grade this assignment');
      }
     
      
      const maxPoints = submission.assignment?.maxPoints || 100;
      let finalGrade = gradeData.grade;

     

      if (gradeData.grade < 0) {
        finalGrade = 0;
      }

      if (gradeData.grade > maxPoints) {
        finalGrade = maxPoints;
      }
     

      
      const gradeEntity = new GradeEntity({
        submissionId: submission.id,
        graderId: graderId,
        grade: finalGrade,
        feedback: gradeData.feedback || null,
        gradedAt: new Date(),
        maxPoints: maxPoints,
        studentId: submission.studentId,
        assignmentId: submission.assignmentId,
        courseId: courseId
      });
      
      const gradedSubmission = await this.gradeRepo.saveGrade(submissionId, {
        grade: gradeEntity.grade,
        feedback: gradeEntity.feedback,
        graderId: gradeEntity.graderId
      });
     
      const resultEntity = GradeEntity.fromSubmission(gradedSubmission);
    
      

      return { entity: resultEntity, submission: gradedSubmission };

    } catch (error) {
      console.log("fixed");
      throw error;
    }
  }
}
