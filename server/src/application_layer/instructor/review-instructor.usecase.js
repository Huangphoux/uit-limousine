import InstructorApplicationRepository from "../../infrastructure_layer/repository/instructor-application.repository.js";
import InstructorApplicationEntity from "../../domain_layer/instructor-application.entity.js";
import { CourseRepository } from "../../infrastructure_layer/repository/course.repository.postgree.js";
import { CourseEntity } from "../../domain_layer/course/course.entity.js";
import prisma from "../../../prisma/client.js";

export default class ReviewInstructorUseCase {
  constructor() {
    this.applicationRepo = new InstructorApplicationRepository();
    this.courseRepo = new CourseRepository(prisma);
  }

  async approve(applicationId, reviewerId, note) {
    console.log("[ReviewInstructorUseCase] Input:", {
      applicationId,
      reviewerId,
      hasNote: !!note,
    });

    try {
      const application = await this.applicationRepo.findById(applicationId);

      if (!application) {
        throw new Error("Application not found");
      }
      console.log("[ReviewInstructorUseCase] Application details:", {
        id: application.id,
        applicantName: application.applicant?.name,
        status: application.status,
        courseTitle: application.requestedCourseTitle,
      });
      const entity = InstructorApplicationEntity.fromPrisma(application);

      if (!entity.canBeReviewed()) {
        throw new Error("Application has already been reviewed");
      }

      // 1. Approve application
      const approvedApplication = await this.applicationRepo.approve(
        applicationId,
        reviewerId,
        note
      );

      // 2. Assign instructor role
      await this.applicationRepo.assignInstructorRole(application.applicantId);

      // 3. Create course from application
      const courseData = {
        title: application.requestedCourseTitle,
        description: application.requestedCourseSummary,
        instructorId: application.applicantId,
        published: false, // Course starts as draft
        category: "General",
        level: "BEGINNER",
        language: "vi",
        price: 0,
      };

      const courseEntity = CourseEntity.create(courseData);
      const createdCourse = await this.courseRepo.add(courseEntity);

      console.log("[ReviewInstructorUseCase] Course created:", {
        courseId: createdCourse.id,
        title: createdCourse.title,
        instructorId: createdCourse.instructorId,
      });

      const resultEntity = InstructorApplicationEntity.fromPrisma(approvedApplication);
      console.log("[ReviewInstructorUseCase] Summary:", {
        applicationId: resultEntity.id,
        applicantId: resultEntity.applicantId,
        applicantName: approvedApplication.applicant?.name,
        reviewerId: resultEntity.reviewerId,
        reviewerName: approvedApplication.reviewer?.name,
        status: resultEntity.status,
        reviewedAt: resultEntity.reviewedAt,
        courseId: createdCourse.id,
      });

      return {
        entity: resultEntity,
        application: approvedApplication,
        course: createdCourse,
      };
    } catch (error) {
      console.error("[ReviewInstructorUseCase] Error:", error.message);
      throw error;
    }
  }

  async reject(applicationId, reviewerId, note) {
    console.log("[ReviewInstructorUseCase] Input:", {
      applicationId,
      reviewerId,
      hasNote: !!note,
    });

    try {
      const application = await this.applicationRepo.findById(applicationId);

      if (!application) {
        throw new Error("Application not found");
      }
      const entity = InstructorApplicationEntity.fromPrisma(application);

      if (!entity.canBeReviewed()) {
        throw new Error("Application has already been reviewed");
      }
      const rejectedApplication = await this.applicationRepo.reject(
        applicationId,
        reviewerId,
        note
      );
      const resultEntity = InstructorApplicationEntity.fromPrisma(rejectedApplication);
      console.log("[ReviewInstructorUseCase] Summary:", {
        applicationId: resultEntity.id,
        applicantId: resultEntity.applicantId,
        reviewerId: resultEntity.reviewerId,
        status: resultEntity.status,
        note: resultEntity.note,
      });

      return { entity: resultEntity, application: rejectedApplication };
    } catch (error) {
      console.error("\n[ReviewInstructorUseCase] ==========================================");
      console.error("[ReviewInstructorUseCase] ========== REJECTION FAILED ==========");
      console.error("[ReviewInstructorUseCase] ==========================================");
      console.error("[ReviewInstructorUseCase] Error:", error.message);
      throw error;
    }
  }

  async getAll(filters) {
    try {
      const applications = await this.applicationRepo.findAll(filters);
      return applications;
    } catch (error) {
      console.error("[ReviewInstructorUseCase] ❌ Get all error:", error.message);
      throw error;
    }
  }

  async getById(applicationId) {
    try {
      const application = await this.applicationRepo.findById(applicationId);

      if (!application) {
        throw new Error("Application not found");
      }
      return application;
    } catch (error) {
      console.error("[ReviewInstructorUseCase] ❌ Get by ID error:", error.message);
      throw error;
    }
  }
}
