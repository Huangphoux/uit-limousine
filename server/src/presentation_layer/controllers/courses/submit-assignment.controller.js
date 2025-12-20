import CourseUseCase from '../../../application_layer/courses/course.usecase.js';
import SubmissionMapper from '../../../infrastructure_layer/mapper/submission.mapper.js';

const courseUseCase = new CourseUseCase();

export const submitAssignment = async (req, res) => {


  try {
    const { assignmentId } = req.params;
    const { content, fileUrl } = req.body;
    const studentId = req.body.authId;


    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId'
      });
    }

    if (!content && !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either content or file'
      });
    }



    const submission = await courseUseCase.submitAssignment(
      assignmentId,
      studentId,
      { content, fileUrl }
    );



    const submissionDTO = SubmissionMapper.toDTO(submission);


    return res.status(201).json({
      success: true,
      message: submission.status === 'LATE'
        ? 'Assignment submitted successfully (Late submission)'
        : 'Assignment submitted successfully',
      data: submissionDTO
    });

  } catch (error) {


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

export const getSubmission = async (req, res) => {

  try {
    const { assignmentId } = req.params;
    const studentId = req.body.authId;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId'
      });
    }
    const submission = await courseUseCase.getSubmission(assignmentId, studentId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    const submissionDTO = SubmissionMapper.toDTO(submission);

    return res.status(200).json({
      success: true,
      data: submissionDTO
    });
  } catch (error) {
    if (error.message === 'Assignment not found') {
      return res.status(404).json({
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

