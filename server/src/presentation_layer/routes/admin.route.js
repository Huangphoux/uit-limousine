import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { coverUploadMiddleware } from "../middlewares/cover-upload.middleware.js";
import { roleAuthorizationMiddleware } from "../middlewares/role-authorization.middleware.js";
import { Role } from "../../domain_layer/role.entity.js";
import { controller } from "../controllers/generic.controller.js";
import {
  changeRoleUsecase,
  createCourseUsecase,
  getUsersUsecase,
  createUserByAdminUsecase,
  updateUserByAdminUsecase,
  deleteUserByAdminUsecase,
  approveCourseUseCase,
} from "../../composition-root.js";
import { getAllCoursesForAdmin } from "../controllers/courses/course.controller.js";

const router = Router();

router.get(
  "/users",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  controller(getUsersUsecase)
);
router.put(
  "/users/:id/role",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  controller(changeRoleUsecase)
);
router.get(
  "/courses/",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  getAllCoursesForAdmin
);
router.post(
  "/courses",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  coverUploadMiddleware,
  controller(createCourseUsecase)
);
router.delete(
  "/courses/:id",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  controller(createCourseUsecase)
);
router.patch(
  "/courses/:id/update-publish-status",
  authenticationMiddleware,
  roleAuthorizationMiddleware("ADMIN"),
  controller(approveCourseUseCase)
);
router.post(
  "/users",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  controller(createUserByAdminUsecase)
);
router.put(
  "/users/:id",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  controller(updateUserByAdminUsecase)
);
router.delete(
  "/users/:id",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  controller(deleteUserByAdminUsecase)
);
router.delete(
  "/courses/:id",
  authenticationMiddleware,
  roleAuthorizationMiddleware(Role.ADMIN),
  controller(createCourseUsecase)
);
export default router;
