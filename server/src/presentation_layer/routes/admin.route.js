import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { roleAuthorizationMiddleware } from "../middlewares/role-authorization.middleware.js";
import { Role } from "../../domain_layer/role.entity.js";
import { getUsersController } from "../controllers/user/get-users.controller.js";
import { changeRoleController } from "../controllers/user/change-role.controller.js";

const router = Router();

router.get('/users', authenticationMiddleware, roleAuthorizationMiddleware(Role.ADMIN), getUsersController);
router.put('/users/:id/role', authenticationMiddleware, roleAuthorizationMiddleware(Role.ADMIN), changeRoleController);

export default router;