const CourseUseCase = require('../../../application_layer/courses/course.usecase');
const SubmissionMapper = require('../../../infrastructure_layer/mapper/submission.mapper');

class SubmitAssignmentController {
  constructor() {
    this.courseUseCase = new CourseUseCase();
  }

  async handle(req, res) {
    try {
      const { assignmentId } = req.params;
      const { content, fileUrl } = req.body;
      const studentId = req.user.id; // từ authentication middleware

      // Validate input
      if (!content && !fileUrl) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either content or file'
        });
      }

      // Submit assignment
      const submission = await this.courseUseCase.submitAssignment(
        assignmentId,
        studentId,
        { content, fileUrl }
      );

      // Map to DTO
      const submissionDTO = SubmissionMapper.toDTO(submission);

      return res.status(201).json({
        success: true,
        message: submission.status === 'LATE' 
          ? 'Assignment submitted successfully (Late submission)' 
          : 'Assignment submitted successfully',
        data: submissionDTO
      });

    } catch (error) {
      console.error('Submit assignment error:', error);
      
      if (error.message === 'Assignment not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'You are not enrolled in this course' ||
          error.message === 'You have already submitted this assignment') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = SubmitAssignmentController;
