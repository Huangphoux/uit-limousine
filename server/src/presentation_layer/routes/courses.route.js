import { Router } from "express";
import { courseMaterialsQueryController, enrollCoursesController, searchCoursesController } from "../../composition-root.js";
import { getCourseById } from '../controllers/courses/course.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// GET /courses?search=nodejs&category=programming&page=1&limit=10
router.get('/', authenticateToken, async (req, res) => await searchCoursesController.execute(req, res));
router.get('/:id', authenticateToken, getCourseById);
router.post('/:courseId/enroll', authenticateToken, async (req, res) => await enrollCoursesController.execute(req, res));
router.get('/:courseId/materials', authenticateToken, async (req, res) => await courseMaterialsQueryController.execute(req, res));

export default router;