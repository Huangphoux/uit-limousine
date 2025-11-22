import { PrismaClient } from "@prisma/client";
import { config } from "./config.js"

import { LoginController } from "./presentation_layer/controllers/authentication/login.controller.js";
import { LoginUseCase } from "./application_layer/authentication/login.usecase.js";
import { UserRepositoryPostgree } from "./infrustructure_layer/repository/user.repository.postgree.js";
import { TokenRepositoryPostgree } from "./infrustructure_layer/repository/token.repository.postgree.js";

import { LogoutController } from "./presentation_layer/controllers/authentication/logout.controller.js";
import { LogoutUseCase } from "./application_layer/authentication/logout.usecase.js";

import { RegisterController } from "./presentation_layer/controllers/authentication/register.controller.js";
import { RegisterUseCase } from "./application_layer/authentication/register.usecase.js";
import { RoleRepositoryPostgree } from "./infrustructure_layer/repository/role.repository.postgree.js";
import { CourseRepository } from "./infrustructure_layer/repository/course.repository.postgree.js";
import { SearchCoursesUseCase } from "./application_layer/courses/search-courses.usecase.js";
import { SearchCoursesController } from "./presentation_layer/controllers/courses/search-courses.controller.js";
import { EnrollCoursesController } from "./presentation_layer/controllers/courses/enroll-courses.controller.js";
import { EnrollCoursesUseCase } from "./application_layer/courses/enroll-courses.usecase.js";
import { EnrollmentRepositoryPostgree } from "./infrustructure_layer/repository/enrollment.repository.postgree.js";
import { CourseMaterialsQueryController } from "./presentation_layer/controllers/courses/course-materials-query.controller.js";
import { CourseMaterialsQueryUseCase } from "./application_layer/courses/course-materials-query.usecase.js";
import { CourseReadAccessor } from "./infrustructure_layer/read_accessor/course.read-accessor.js";
import { UserReadAccessor } from "./infrustructure_layer/read_accessor/user.read-accessor.js";
import { CompleteLessonUseCase } from "./application_layer/lessons/complete-lesson.usecase.js";
import { CompleteLessonController } from "./presentation_layer/controllers/lessons/complete-lesson.controller.js";
import { LessonProgressRepositoryPostgree } from "./infrustructure_layer/repository/lesson-progress.repository.postgree.js";
import { ModifyCourseUsecase } from "./application_layer/courses/modify-course.usecase.js";
import { AuditLogRepository } from "./infrustructure_layer/repository/audit-log.repository.js";
import { GetUsersUsecase } from "./application_layer/instructor/get-users.usecase.js";
import { ChangeRoleUsecase } from "./application_layer/instructor/change-role.usecase.js";

export const prisma = new PrismaClient();

const userRepository = new UserRepositoryPostgree(prisma.user);
const tokenRepository = new TokenRepositoryPostgree(prisma.token);
const loginUseCase = new LoginUseCase(userRepository, tokenRepository);
export const loginController = new LoginController(loginUseCase);

const logoutUseCase = new LogoutUseCase(tokenRepository);
export const logoutController = new LogoutController(logoutUseCase);

const roleRepository = new RoleRepositoryPostgree(prisma.role);
const registerUseCase = new RegisterUseCase(userRepository, roleRepository, config.bcrypt);
export const registerController = new RegisterController(registerUseCase);

export const courseRepository = new CourseRepository(prisma.course);
const searchCoursesUseCase = new SearchCoursesUseCase(courseRepository);
export const searchCoursesController = new SearchCoursesController(searchCoursesUseCase);

const enrollmentRepository = new EnrollmentRepositoryPostgree(prisma.enrollment);
const enrollCoursesUseCase = new EnrollCoursesUseCase(userRepository, courseRepository, enrollmentRepository);
export const enrollCoursesController = new EnrollCoursesController(enrollCoursesUseCase);

const userReadAccessor = new UserReadAccessor(prisma);
const courseReadAccessor = new CourseReadAccessor(prisma);
const courseMaterialsQueryUsecase = new CourseMaterialsQueryUseCase(courseReadAccessor, userReadAccessor);
export const courseMaterialsQueryController = new CourseMaterialsQueryController(courseMaterialsQueryUsecase);

const lessonProgressRepository = new LessonProgressRepositoryPostgree(prisma.lessonProgress);
const completeLessonUseCase = new CompleteLessonUseCase(userRepository, lessonProgressRepository);
export const completeLessonController = new CompleteLessonController(completeLessonUseCase);

const auditLogRepository = new AuditLogRepository(prisma);
export const modifyCourseUsecase = new ModifyCourseUsecase(courseRepository, auditLogRepository);

export const getUsersUsecase = new GetUsersUsecase(userReadAccessor);
export const changeRoleUsecase = new ChangeRoleUsecase(userRepository, roleRepository);