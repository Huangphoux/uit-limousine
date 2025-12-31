import { config } from "../src/config.js";

import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

import { UserRepositoryPostgree } from "../src/infrastructure_layer/repository/user.repository.postgree.js";
import { RoleRepositoryPostgree } from "../src/infrastructure_layer/repository/role.repository.postgree.js";
import { EnrollmentRepositoryPostgree } from "../src/infrastructure_layer/repository/enrollment.repository.postgree.js";
import { LessonProgressRepositoryPostgree } from "../src/infrastructure_layer/repository/lesson-progress.repository.postgree.js";
import { AuditLogRepository } from "../src/infrastructure_layer/repository/audit-log.repository.js";
import { TokenRepository } from "../src/infrastructure_layer/repository/token.repository.js";
import { LessonRepository } from "../src/infrastructure_layer/repository/lesson.repository.js";
import { ModuleRepository } from "../src/infrastructure_layer/repository/module.repository.js";
import { LessonResourceRepository } from "../src/infrastructure_layer/repository/lesson-resource.repository.js";

import { CourseReadAccessor } from "../src/infrastructure_layer/read_accessor/course.read-accessor.js";
import { UserReadAccessor } from "../src/infrastructure_layer/read_accessor/user.read-accessor.js";
import { PaymentReadAccessor } from "../src/infrastructure_layer/read_accessor/payment.read-accessor.js";
import { LessonProgressReadAccessor } from "../src/infrastructure_layer/read_accessor/lesson-progress.read-access.js";
import { EnrollmentReadAccessor } from "../src/infrastructure_layer/read_accessor/enrollment.read-accessor.js";
import { ModuleReadAccessor } from "../src/infrastructure_layer/read_accessor/module.read-accessor.js";
import { LessonReadAccessor } from "../src/infrastructure_layer/read_accessor/lesson.read-accessor.js";
import { LessonResourceReadAccessor } from "../src/infrastructure_layer/read_accessor/lesson-resource.read-accessor.js";

import { EmailSenderNodemailer } from "../src/infrastructure_layer/email/email-sender.nodemailer.js";

import { LoginUseCase } from "../src/application_layer/authentication/login.usecase.js";
import { RegisterUseCase } from "../src/application_layer/authentication/register.usecase.js";
import { CourseRepository } from "../src/infrastructure_layer/repository/course.repository.postgree.js";
import { SearchCoursesUseCase } from "../src/application_layer/courses/search-courses.usecase.js";
import { EnrollCourseUseCase } from "../src/application_layer/courses/enroll-course.usecase.js";
import { CourseMaterialsQueryUseCase } from "../src/application_layer/courses/course-materials-query.usecase.js";
import { CompleteLessonUseCase } from "../src/application_layer/lessons/complete-lesson.usecase.js";
import { ModifyCourseUsecase } from "../src/application_layer/courses/modify-course.usecase.js";
import { GetUsersUsecase } from "../src/application_layer/instructor/get-users.usecase.js";
import { ChangeRoleUsecase } from "../src/application_layer/instructor/change-role.usecase.js";
import { CreateCourseUsecase } from "../src/application_layer/courses/create-course.usecase.js";
import { RequestPasswordResetUsecase } from "../src/application_layer/authentication/forgot-password.usecase.js";
import { ResetPasswordUsecase } from "../src/application_layer/authentication/reset-password.usecase.js";
import { UnenrollCourseUseCase } from "../src/application_layer/courses/unenroll-course.usecase.js";
import { CreateUserByAdminUsecase } from "../src/application_layer/users/create-users.usecase.js";
import { UpdateUserByAdminUsecase } from "../src/application_layer/users/update-user.usecase.js";
import { DeleteUserByAdminUsecase } from "../src/application_layer/users/delete-user.usecase.js";
import { ApproveCourseUseCase } from "../src/application_layer/courses/approve-course.usecase.js";
import { UpdateCourseUsecase } from "../src/application_layer/courses/update-course.usecase.js";
import { UpdateLessonUsecase } from "../src/application_layer/courses/update-lesson.usecase.js";
import { UpdateModuleUsecase } from "../src/application_layer/courses/update-module.usecase.js";
import { DeleteOrphanedModulesUsecase } from "../src/application_layer/courses/delete-orphaned-modules.usecase.js";
import { DeleteOrphanedLessonsUsecase } from "../src/application_layer/courses/delete-orphaned-lessons.usecase.js";
import { DeleteOrphanedLessonResourcesUsecase } from "../src/application_layer/courses/delete-orphaned-lesson-resources.usecase.js";
import AssignmentRepository from "../src/infrastructure_layer/repository/assignment.repository.js";
import { UpdateAssignmentUsecase } from "../src/application_layer/courses/update-assignment.usecase.js";

// externals
export const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Repositories
const userRepository = new UserRepositoryPostgree(prisma);
const roleRepository = new RoleRepositoryPostgree(prisma);
export const courseRepository = new CourseRepository(prisma);
const enrollmentRepository = new EnrollmentRepositoryPostgree(prisma);
const lessonProgressRepository = new LessonProgressRepositoryPostgree(prisma);
const auditLogRepository = new AuditLogRepository(prisma);
const tokenRepo = new TokenRepository(prisma);
const lessonRepo = new LessonRepository(prisma);
const moduleRepo = new ModuleRepository(prisma);
const lessonResourceRepo = new LessonResourceRepository(prisma);
const assignmentRepo = new AssignmentRepository(prisma);

// Read accessors
const paymentReadAccessor = new PaymentReadAccessor(prisma);
const enrollmentReadAccessor = new EnrollmentReadAccessor(prisma);
const userReadAccessor = new UserReadAccessor(prisma);
const courseReadAccessor = new CourseReadAccessor(prisma);
const lessonProgressReadAccessor = new LessonProgressReadAccessor(prisma);
const moduleRead = new ModuleReadAccessor(prisma);
const lessonRead = new LessonReadAccessor(prisma);
const lessonResourceRead = new LessonResourceReadAccessor(prisma);

// Email
const emailSender = new EmailSenderNodemailer(transporter);

// Services
export const loginUseCase = new LoginUseCase(userRepository);
export const registerUseCase = new RegisterUseCase(userRepository, roleRepository);
export const searchCoursesUseCase = new SearchCoursesUseCase(courseRepository);
export const enrollCoursesUseCase = new EnrollCourseUseCase(
  courseRepository,
  paymentReadAccessor,
  enrollmentRepository
);
export const unenrollCourseUseCase = new UnenrollCourseUseCase(enrollmentRepository);
export const courseMaterialsQueryUsecase = new CourseMaterialsQueryUseCase(
  courseReadAccessor,
  enrollmentReadAccessor,
);
export const completeLessonUseCase = new CompleteLessonUseCase(
  courseRepository,
  enrollmentReadAccessor,
  lessonProgressRepository,
  lessonProgressReadAccessor
);
export const modifyCourseUsecase = new ModifyCourseUsecase(courseRepository, auditLogRepository);
export const updateAssignmentUsecase = new UpdateAssignmentUsecase(assignmentRepo);
export const updateCourseUsecase = new UpdateCourseUsecase(courseRepository);
export const updateModuleUsecase = new UpdateModuleUsecase(moduleRepo);
export const updateLessonUsecase = new UpdateLessonUsecase(lessonRepo);
export const deleteOrphanedModulesUsecase = new DeleteOrphanedModulesUsecase(moduleRepo, moduleRead);
export const deleteOrphanedLessonsUsecase = new DeleteOrphanedLessonsUsecase(lessonRepo, lessonRead);
export const deleteOrphanedLessonResourcesUsecase = new DeleteOrphanedLessonResourcesUsecase(lessonResourceRepo, lessonResourceRead);
export const getUsersUsecase = new GetUsersUsecase(userReadAccessor);
export const changeRoleUsecase = new ChangeRoleUsecase(userRepository, roleRepository);
export const createCourseUsecase = new CreateCourseUsecase(userRepository, courseRepository);
export const requestPasswordResetUsecase = new RequestPasswordResetUsecase(
  userReadAccessor,
  tokenRepo,
  emailSender
);
export const resetPasswordUsecase = new ResetPasswordUsecase(tokenRepo, userRepository);
export const createUserByAdminUsecase = new CreateUserByAdminUsecase(userRepository);
export const updateUserByAdminUsecase = new UpdateUserByAdminUsecase(userRepository);
export const deleteUserByAdminUsecase = new DeleteUserByAdminUsecase(userRepository);
export const approveCourseUseCase = new ApproveCourseUseCase(courseRepository, auditLogRepository);
