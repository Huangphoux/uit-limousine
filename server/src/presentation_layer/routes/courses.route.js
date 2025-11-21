import { Router } from "express";
import { courseMaterialsQueryController, enrollCoursesController, searchCoursesController } from "../../composition-root.js";
import { getCourseById } from '../controllers/courses/course.controller.js';
import { submitAssignment } from '../controllers/courses/submit-assignment.controller.js';
import { modifyCourse } from "../controllers/courses/modify-course.controller.js";
import { authenticationMiddleware } from "../middlewares/authenticate.middleware.js";

const router = Router();

// GET /courses?search=nodejs&category=programming&page=1&limit=10
router.get('/', async (req, res) => await searchCoursesController.execute(req, res));
router.get('/:id', getCourseById);
router.post('/:courseId/enroll', async (req, res) => await enrollCoursesController.execute(req, res));
router.get('/:courseId/materials', async (req, res) => await courseMaterialsQueryController.execute(req, res));
router.post('/assignments/:assignmentId/submit', submitAssignment);
router.put('/:courseId', authenticationMiddleware, modifyCourse);

export default router;