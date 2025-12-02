import { Router } from "express";
import { loginUseCase, registerUseCase } from "../../composition-root.js";
import {
  registerController,
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginController(loginUseCase));
router.post("/register", registerController(registerUseCase));
router.post("/logout", logoutController());

export default router;
