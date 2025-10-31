import { Router } from 'express';

import { getCourseById, getAllCourses } from '../controllers/courses/course.controller.js';

const router = Router();

// Route lấy chi tiết khoá học
router.get('/:id', getCourseById);

export default router;