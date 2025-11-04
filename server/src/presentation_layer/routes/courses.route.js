import { Router } from "express";
import { searchCoursesController } from "../../composition-root.js";

const router = Router();

// GET /api/courses?search=nodejs&category=programming&page=1&limit=10
router.get('/', async (req, res) => await searchCoursesController.execute(req, res));

export default router;