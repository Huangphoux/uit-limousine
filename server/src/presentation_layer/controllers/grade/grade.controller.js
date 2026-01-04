import GradeUseCase from "../../../application_layer/grade/grade.usecase.js";
import GradeMapper from "../../../infrastructure_layer/mapper/grade.mapper.js";

const gradeUseCase = new GradeUseCase();

export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { graderId, grade, feedback } = req.body;

    if (!submissionId || submissionId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Submission ID is required",
        field: "submissionId",
      });
    }
    if (!graderId || graderId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Grader ID is required",
        field: "graderId",
      });
    }
    if (grade === undefined || grade === null || grade === "") {
      return res.status(400).json({
        success: false,
        message: "Grade is required",
        field: "grade",
      });
    }
    const numericGrade = Number(grade);

    if (isNaN(numericGrade)) {
      return res.status(400).json({
        success: false,
        message: "Grade must be a valid number",
        field: "grade",
        received: grade,
      });
    }

    if (numericGrade < 0 || numericGrade > 100) {
      return res.status(400).json({
        success: false,
        message: "Grade must be between 0 and 100",
        field: "grade",
        received: numericGrade,
      });
    }
    const result = await gradeUseCase.executeGrading(submissionId, graderId, {
      grade: numericGrade,
      feedback: feedback?.trim() || null,
    });
    const responseDTO = GradeMapper.toDTO(result.entity, result.submission);

    // Check if this was an update (submission was already graded)
    const wasAlreadyGraded =
      result.submission.status === "GRADED" && result.submission.grade !== null;

    return res.status(200).json({
      success: true,
      message: wasAlreadyGraded
        ? "Submission grade updated successfully"
        : "Submission graded successfully",
      data: responseDTO,
    });
  } catch (error) {
    if (error.message === "Submission not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
        submissionId: req.params.submissionId,
      });
    }
    if (error.message === "Only the course instructor can grade this assignment") {
      return res.status(403).json({
        success: false,
        message: error.message,
        hint: "You must be the course instructor to grade submissions",
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while grading the submission",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
