import { Router } from "express";
import { loginUseCase, registerUseCase } from "../../composition-root.js";
import { controller } from "../controllers/generic.controller.js";

const router = Router();

router.post('/login', controller(loginUseCase));
router.post('/register', controller(registerUseCase));

export default router;