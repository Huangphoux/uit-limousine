import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { roleAuthorizationMiddleware } from "../middlewares/role-authorization.middleware.js";
import { Role } from "../../domain_layer/role.entity.js";
import { controller } from "../controllers/generic.controller.js";
import { changeRoleUsecase, createCourseUsecase, getUsersUsecase } from "../../composition-root.js";

const router = Router();

router.get('/users', authenticationMiddleware, roleAuthorizationMiddleware(Role.ADMIN), controller(getUsersUsecase));
router.put('/users/:id/role', authenticationMiddleware, roleAuthorizationMiddleware(Role.ADMIN), controller(changeRoleUsecase));
router.post('/courses', authenticationMiddleware, roleAuthorizationMiddleware(Role.ADMIN), controller(createCourseUsecase))

export default router;