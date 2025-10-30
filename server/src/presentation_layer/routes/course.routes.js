import { Router } from 'express';
import { getCourseById, getAllCourses } from '../controllers/courses/course.controller.js';

const router = Router();

router.get('/', getAllCourses);        
router.get('/:id', getCourseById);     

export default router;