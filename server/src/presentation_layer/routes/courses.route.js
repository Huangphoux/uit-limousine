import { Router } from "express";
import { searchCoursesController, getCourseByIdController } from "../../composition-root.js";

const router = Router();

// GET /api/courses?search=nodejs&category=programming&page=1&limit=10
router.get('/', async (req, res) => await searchCoursesController.execute(req, res));

// GET /api/courses/:id
router.get('/:id', async (req, res) => await getCourseByIdController.execute(req, res));

export default router;