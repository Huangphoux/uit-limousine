import { Router } from "express";
import { completeLessonUseCase } from "../../composition-root.js";
import { controller } from "../controllers/generic.controller.js";

const router = Router();

router.post('/:lessonId/complete', controller(completeLessonUseCase));

export default router;