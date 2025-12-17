import InstructorApplicationRepository from '../../infrastructure_layer/repository/instructor-application.repository.js';
import InstructorApplicationEntity from '../../domain_layer/instructor-application.entity.js';

export default class ApplyInstructorUseCase {
  constructor() {
    this.applicationRepo = new InstructorApplicationRepository();
  }

  async execute(applicantId, applicationData) {
    console.log('[ApplyInstructorUseCase] Input:', {
      applicantId,
      courseTitle: applicationData.requestedCourseTitle,
      hasPortfolio: !!applicationData.portfolioUrl,
      timestamp: new Date().toISOString()
    });

    try {
      const existingApplication = await this.applicationRepo.findPendingByApplicant(applicantId);

      if (existingApplication) {
        console.log('[ApplyInstructorUseCase] Existing application:', {
          id: existingApplication.id,
          status: existingApplication.status,
          appliedAt: existingApplication.appliedAt
        });
        throw new Error('You already have a pending application');
      }
      if (!applicationData.requestedCourseTitle || applicationData.requestedCourseTitle.trim() === '') {
        throw new Error('Course title is required');
      }

      if (applicationData.requestedCourseTitle.length < 10) {
        throw new Error('Course title must be at least 10 characters');
      }

      if (!applicationData.requestedCourseSummary || applicationData.requestedCourseSummary.trim() === '') {
        throw new Error('Course summary is required');
      }

      if (applicationData.requestedCourseSummary.length < 50) {
        throw new Error('Course summary must be at least 50 characters');
      }
      console.log('[ApplyInstructorUseCase] Validated data:', {
        titleLength: applicationData.requestedCourseTitle.length,
        summaryLength: applicationData.requestedCourseSummary.length,
        hasPortfolio: !!applicationData.portfolioUrl
      });
      const newApplication = await this.applicationRepo.create({
        applicantId,
        requestedCourseTitle: applicationData.requestedCourseTitle.trim(),
        requestedCourseSummary: applicationData.requestedCourseSummary.trim(),
        portfolioUrl: applicationData.portfolioUrl?.trim() || null,
        status: 'PENDING',
        appliedAt: new Date()
      });
      const entity = InstructorApplicationEntity.fromPrisma(newApplication);


      return { entity, application: newApplication };

    } catch (error) {

      console.error('[ApplyInstructorUseCase] Error:', error.message);
      throw error;
    }
  }
}