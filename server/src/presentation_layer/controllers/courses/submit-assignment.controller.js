import CourseUseCase from '../../../application_layer/courses/course.usecase.js';
import SubmissionMapper from '../../../infrastructure_layer/mapper/submission.mapper.js';
import FileStorageService from '../../../infrastructure_layer/storage/file-storage.service.js';
import { config } from '../../../config.js';

const courseUseCase = new CourseUseCase();
const fileStorageService = new FileStorageService(config.upload.uploadDir);

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content, studentId } = req.body;
    const file = req.file;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId'
      });
    }

    if (!content && !file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either content or file'
      });
    }

    let fileData = null;
    if (file) {
      fileData = await fileStorageService.saveSubmissionFile(
        file,
        studentId,
        assignmentId
      );
    }

    const submission = await courseUseCase.submitAssignment(
      assignmentId,
      studentId,
      {
        content: content || null,
        fileUrl: fileData ? fileData.fileUrl : null,
        fileName: fileData ? fileData.fileName : null,
        fileSize: fileData ? fileData.fileSize : null,
        mimeType: fileData ? fileData.mimeType : null
      }
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

