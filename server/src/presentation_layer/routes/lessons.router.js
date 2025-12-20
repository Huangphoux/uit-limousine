import { Router } from "express";
import { completeLessonUseCase } from "../../composition-root.js";
import { controller } from "../controllers/generic.controller.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";

const router = Router();

router.post('/:lessonId/complete', authenticationMiddleware, controller(completeLessonUseCase));

export default router;