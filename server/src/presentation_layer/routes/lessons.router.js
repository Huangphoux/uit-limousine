import { Router } from "express";
import { completeLessonController } from "../../composition-root";

const router = Router();

router.post('/:lessonId/complete', async (req, res) => await completeLessonController.execute(req, res));

export default router;