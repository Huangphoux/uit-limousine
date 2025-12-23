import ApplyInstructorUseCase from '../../../application_layer/instructor/apply-instructor.usecase.js';
import ReviewInstructorUseCase from '../../../application_layer/instructor/review-instructor.usecase.js';
import InstructorApplicationMapper from '../../../infrastructure_layer/mapper/instructor-application.mapper.js';
import InstructorApplicationEntity from '../../../domain_layer/instructor-application.entity.js';

const applyUseCase = new ApplyInstructorUseCase();
const reviewUseCase = new ReviewInstructorUseCase();
export const applyInstructor = async (req, res) => {


  try {
    const { applicantId, requestedCourseTitle, requestedCourseSummary, portfolioUrl } = req.body;
    if (!applicantId || applicantId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Applicant ID is required',
        field: 'applicantId'
      });
    }
    if (!requestedCourseTitle || requestedCourseTitle.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Course title is required',
        field: 'requestedCourseTitle'
      });
    }
    if (!requestedCourseSummary || requestedCourseSummary.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Course summary is required',
        field: 'requestedCourseSummary'
      });
    }
    const result = await applyUseCase.execute(applicantId, {
      requestedCourseTitle,
      requestedCourseSummary,
      portfolioUrl
    });
    const dto = InstructorApplicationMapper.toDTO(result.entity, result.application);
    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: dto
    });

  } catch (error) {
    if (error.message === 'You already have a pending application') {
      return res.status(409).json({
        success: false,
        message: error.message,
        hint: 'Please wait for your current application to be reviewed'
      });
    }
    if (error.message.includes('required') || error.message.includes('must be')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
export const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reviewerId, note } = req.body;
    if (!applicationId || applicationId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required'
      });
    }
    if (!reviewerId || reviewerId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reviewer ID is required',
        field: 'reviewerId'
      });
    }
    const result = await reviewUseCase.approve(applicationId, reviewerId, note);
    const dto = InstructorApplicationMapper.toDTO(result.entity, result.application);
    return res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      data: dto
    });

  } catch (error) {
    if (error.message === 'Application not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'Application has already been reviewed') {
      return res.status(409).json({
        success: false,
        message: error.message,
        hint: 'This application has already been approved or rejected'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'An error occurred while approving the application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reviewerId, note } = req.body;
    if (!applicationId || applicationId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required'
      });
    }
    if (!reviewerId || reviewerId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reviewer ID is required',
        field: 'reviewerId'
      });
    }
    if (!note || note.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection note is required',
        field: 'note',
        hint: 'Please provide a reason for rejection'
      });
    }
    const result = await reviewUseCase.reject(applicationId, reviewerId, note);
    const dto = InstructorApplicationMapper.toDTO(result.entity, result.application);
    return res.status(200).json({
      success: true,
      message: 'Application rejected successfully',
      data: dto
    });

  } catch (error) {
    if (error.message === 'Application not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'Application has already been reviewed') {
      return res.status(409).json({
        success: false,
        message: error.message,
        hint: 'This application has already been approved or rejected'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'An error occurred while rejecting the application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
export const getAllApplications = async (req, res) => {
  try {
    const { status, applicantId } = req.query;
    if (status) {
      const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value',
          validValues: validStatuses
        });
      }
    }
    const applications = await reviewUseCase.getAll({ status, applicantId });
    const dto = InstructorApplicationMapper.toListDTO(applications);
    return res.status(200).json({
      success: true,
      count: dto.length,
      filters: { status: status || 'all', applicantId: applicantId || 'all' },
      data: dto
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching applications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    if (!applicationId || applicationId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required'
      });
    }
    const application = await reviewUseCase.getById(applicationId);
    const entity = InstructorApplicationEntity.fromPrisma(application);
    const dto = InstructorApplicationMapper.toDTO(entity, application);
    return res.status(200).json({
      success: true,
      data: dto
    });

  } catch (error) {
    if (error.message === 'Application not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
        applicationId: req.params.applicationId
      });
    }
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
