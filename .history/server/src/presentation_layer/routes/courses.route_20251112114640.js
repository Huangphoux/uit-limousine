import { Router } from "express";
import { searchCoursesController } from "../../composition-root.js";
import { getCourseById } from '../controllers/courses/course.controller.js';
import { submitAssignment } from '../controllers/courses/submit-assignment.controller.js';
 
const router = Router();


router.get('/', async (req, res) => await searchCoursesController.execute(req, res));
router.get('/:id', getCourseById);
router.post('/assignments/:assignmentId/submit', submitAssignment);

export default router;


import { Router } from "express";
import { searchCoursesController } from "../../composition-root.js";
import { getCourseById, getAllCourses } from '../controllers/courses/course.controller.js';

const router = Router();

// GET /courses?search=nodejs&category=programming&page=1&limit=10
router.get('/', async (req, res) => await searchCoursesController.execute(req, res));
router.get('/:id', getCourseById);

export default router;