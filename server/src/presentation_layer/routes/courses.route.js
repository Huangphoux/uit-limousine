import { Router } from "express";
import { searchCoursesController } from "../../composition-root.js";
import { getCourseById } from '../controllers/courses/course.controller.js';
import { submitAssignment } from '../controllers/courses/submit-assignment.controller.js';
 
import { courseMaterialsQueryController, enrollCoursesController, searchCoursesController } from "../../composition-root.js";
import { getCourseById } from '../controllers/courses/course.controller.js';

const router = Router();

// GET /courses?search=nodejs&category=programming&page=1&limit=10
router.get('/', async (req, res) => await searchCoursesController.execute(req, res));
router.get('/:id', getCourseById);
router.post('/assignments/:assignmentId/submit', submitAssignment);
router.post('/:courseId/enroll', async (req, res) => await enrollCoursesController.execute(req, res));
router.get('/:courseId/materials', async (req, res) => await courseMaterialsQueryController.execute(req, res));

export default router;