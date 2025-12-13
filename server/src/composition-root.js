import { PrismaClient } from "@prisma/client";

import { UserRepositoryPostgree } from "./infrastructure_layer/repository/user.repository.postgree.js";
import { RoleRepositoryPostgree } from "./infrastructure_layer/repository/role.repository.postgree.js";
import { EnrollmentRepositoryPostgree } from "./infrastructure_layer/repository/enrollment.repository.postgree.js";
import { LessonProgressRepositoryPostgree } from "./infrastructure_layer/repository/lesson-progress.repository.postgree.js";
import { AuditLogRepository } from "./infrastructure_layer/repository/audit-log.repository.js";

import { CourseReadAccessor } from "./infrastructure_layer/read_accessor/course.read-accessor.js";
import { UserReadAccessor } from "./infrastructure_layer/read_accessor/user.read-accessor.js";
import { PaymentReadAccessor } from "./infrastructure_layer/read_accessor/payment.read-accessor.js";
import { LessonProgressReadAccessor } from "./infrastructure_layer/read_accessor/lesson-progress.read-access.js";
import { EnrollmentReadAccessor } from "./infrastructure_layer/read_accessor/enrollment.read-accessor.js";

import { LoginUseCase } from "./application_layer/authentication/login.usecase.js";
import { RegisterUseCase } from "./application_layer/authentication/register.usecase.js";
import { CourseRepository } from "./infrastructure_layer/repository/course.repository.postgree.js";
import { SearchCoursesUseCase } from "./application_layer/courses/search-courses.usecase.js";
import { EnrollCourseUseCase } from "./application_layer/courses/enroll-course.usecase.js";
import { CourseMaterialsQueryUseCase } from "./application_layer/courses/course-materials-query.usecase.js";
import { CompleteLessonUseCase } from "./application_layer/lessons/complete-lesson.usecase.js";
import { ModifyCourseUsecase } from "./application_layer/courses/modify-course.usecase.js";
import { GetUsersUsecase } from "./application_layer/instructor/get-users.usecase.js";
import { ChangeRoleUsecase } from "./application_layer/instructor/change-role.usecase.js";
import { CreateCourseUsecase } from "./application_layer/courses/create-course.usecase.js";

export const prisma = new PrismaClient();

// Repositories
const userRepository = new UserRepositoryPostgree(prisma);
const roleRepository = new RoleRepositoryPostgree(prisma);
export const courseRepository = new CourseRepository(prisma);
const enrollmentRepository = new EnrollmentRepositoryPostgree(prisma);
const lessonProgressRepository = new LessonProgressRepositoryPostgree(prisma);
const auditLogRepository = new AuditLogRepository(prisma);

// Read accessors
const paymentReadAccessor = new PaymentReadAccessor(prisma);
const enrollmentReadAccessor = new EnrollmentReadAccessor(prisma);
const userReadAccessor = new UserReadAccessor(prisma);
const courseReadAccessor = new CourseReadAccessor(prisma);
const lessonProgressReadAccessor = new LessonProgressReadAccessor(prisma)

// Services
export const loginUseCase = new LoginUseCase(userRepository);
export const registerUseCase = new RegisterUseCase(userRepository, roleRepository);
export const searchCoursesUseCase = new SearchCoursesUseCase(courseRepository);
export const enrollCoursesUseCase = new EnrollCourseUseCase(courseRepository, paymentReadAccessor, enrollmentRepository);
export const courseMaterialsQueryUsecase = new CourseMaterialsQueryUseCase(enrollmentReadAccessor, courseReadAccessor);
export const completeLessonUseCase = new CompleteLessonUseCase(courseRepository, enrollmentReadAccessor, lessonProgressRepository, lessonProgressReadAccessor);
export const modifyCourseUsecase = new ModifyCourseUsecase(courseRepository, auditLogRepository);
export const getUsersUsecase = new GetUsersUsecase(userReadAccessor);
export const changeRoleUsecase = new ChangeRoleUsecase(userRepository, roleRepository);
export const createCourseUsecase = new CreateCourseUsecase(userRepository, courseRepository);