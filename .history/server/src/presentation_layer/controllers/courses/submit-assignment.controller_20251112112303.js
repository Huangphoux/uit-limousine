import CourseUseCase from '../../../application_layer/courses/course.usecase.js';
import SubmissionMapper from '../../../infrustructure_layer/mapper/submission.mapper.js';

const courseUseCase = new CourseUseCase();

export const submitAssignment = async (req, res) => {
  console.log('[Controller] Received request:', {
    params: req.params,
    body: req.body
  });

  try {
    const { assignmentId } = req.params;
    const { content, fileUrl, studentId } = req.body;
    
   
    if (!studentId) {
      console.log('[Controller] Missing studentId');
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId'
      });
    }

    if (!content && !fileUrl) {
      console.log('[Controller] Missing content/fileUrl');
      return res.status(400).json({
        success: false,
        message: 'Please provide either content or file'
      });
    }

    console.log('[Controller] Calling useCase...');
    
    // Submit
    const submission = await courseUseCase.submitAssignment(
      assignmentId,
      studentId,
      { content, fileUrl }
    );

    console.log('[Controller] UseCase returned:', submission.id);

    // Map to DTO
    const submissionDTO = SubmissionMapper.toDTO(submission);

    console.log('[Controller] Returning response');
    
    return res.status(201).json({
      success: true,
      message: submission.status === 'LATE' 
        ? 'Assignment submitted successfully (Late submission)' 
        : 'Assignment submitted successfully',
      data: submissionDTO
    });

  } catch (error) {
    console.error('[Controller] Error:', error.message);
    console.error('[Controller] Stack:', error.stack);
    
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
      message: 'Internal server error',
      error: error.message
    });
  }
};

