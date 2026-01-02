import SubmissionRepository from "../../infrastructure_layer/repository/submission.repository.js";
import AssignmentRepository from "../../infrastructure_layer/repository/assignment.repository.js";
import EnrollmentRepository from "../../infrastructure_layer/repository/enrollment.repository.js";
import SubmissionEntity from "../../domain_layer/submission.entity.js";

export default class CourseUseCase {
  constructor() {
    this.submissionRepo = new SubmissionRepository();
    this.assignmentRepo = new AssignmentRepository();
    this.enrollmentRepo = new EnrollmentRepository();
    this.enrollmentRepo = new EnrollmentRepository();
  }

  async submitAssignment(assignmentId, studentId, fileInfo) {
    const assignment = await this.assignmentRepo.findById(assignmentId);

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const enrollment = await this.enrollmentRepo.findByUserAndCourse(
      studentId,
      assignment.courseId
    );

    if (!enrollment || enrollment.status !== "ENROLLED") {
      throw new Error("You are not enrolled in this course");
    }

    const existingSubmission = await this.submissionRepo.findByAssignmentAndStudent(
      assignmentId,
      studentId
    );

    if (existingSubmission) {
      throw new Error("You have already submitted this assignment");
    }

    // If assignment has a dueDate and it's past, reject submissions
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      throw new Error("Submission closed");
    }

    let status = "SUBMITTED";

    const submissionData = {
      assignmentId,
      studentId,
      content: fileInfo.content || null,
      fileUrl: fileInfo.fileUrl || null,
      fileName: fileInfo.fileName || null,
      fileSize: fileInfo.fileSize || null,
      status,
      submittedAt: new Date(),
    };

    // 1. Tạo submission (giữ nguyên logic cũ)
    const newSubmission = await this.submissionRepo.create(submissionData);

    // --- BỔ SUNG LOGIC CẬP NHẬT LESSON PROGRESS ---
    try {
      // Tìm lesson liên kết với assignment này thông qua Prisma trực tiếp
      // hoặc qua LessonRepo nếu bạn đã tách Repo
      const lesson = await prisma.lesson.findFirst({
        where: { assignmentId: assignmentId },
      });

      if (lesson) {
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: {
              userId: studentId,
              lessonId: lesson.id,
            },
          },
          update: {
            progress: 1.0,
            completedAt: new Date(),
          },
          create: {
            userId: studentId,
            lessonId: lesson.id,
            progress: 1.0,
            completedAt: new Date(),
          },
        });
        console.log(`Updated lesson progress for lesson: ${lesson.id}`);
      }
    } catch (progressError) {
      // Log lỗi nhưng không làm fail request nộp bài chính
      console.error("Failed to update lesson progress:", progressError);
    }

    return SubmissionEntity.fromPrisma(newSubmission);
  }

  async getSubmission(assignmentId, studentId) {
    const submission = await this.submissionRepo.findByAssignmentAndStudent(
      assignmentId,
      studentId
    );
    return submission ? SubmissionEntity.fromPrisma(submission) : null;
  }
}
