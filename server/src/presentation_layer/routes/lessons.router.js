import { Router } from "express";
import { completeLessonController } from "../../composition-root.js";
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/:lessonId/complete', authenticateToken, async (req, res) => await completeLessonController.execute(req, res));

export default router;