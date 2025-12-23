import { Router } from "express";
import { loginUseCase, registerUseCase, requestPasswordResetUsecase, resetPasswordUsecase } from "../../composition-root.js";
import {
  logoutController,
} from "../controllers/auth.controller.js";
import { controller } from "../controllers/generic.controller.js";

const router = Router();

router.post("/login", controller(loginUseCase));
router.post("/register", controller(registerUseCase));
router.post("/logout", logoutController());
router.post("/forgot-password", controller(requestPasswordResetUsecase));
router.post("/reset-password", controller(resetPasswordUsecase));

export default router;
