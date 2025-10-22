import { Router } from 'express';
import { getCourseById } from '../controllers/course.controller.js';

const router = Router();

// Route lấy chi tiết khoá học
router.get('/:id', getCourseById);

export default router;