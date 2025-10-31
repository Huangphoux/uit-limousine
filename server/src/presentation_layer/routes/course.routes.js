import { Router } from 'express';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { getCourseById, getAllCourses } from '../controllers/courses/course.controller.js';
=======
import { getCourseById } from '../controllers/course.controller.js';
>>>>>>> parent of 3709e3a (update code)
=======
import { getCourseById } from '../controllers/course.controller.js';
>>>>>>> parent of 3709e3a (update code)
=======
import { getCourseById } from '../controllers/course.controller.js';
>>>>>>> parent of 3709e3a (update code)

const router = Router();

// Route lấy chi tiết khoá học
router.get('/:id', getCourseById);

export default router;