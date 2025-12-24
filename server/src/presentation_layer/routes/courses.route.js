import { Router } from "express";
import { courseMaterialsQueryUsecase, enrollCoursesUseCase, modifyCourseUsecase, searchCoursesUseCase } from "../../composition-root.js";
import { getCourseById } from '../controllers/courses/course.controller.js';
import { submitAssignment } from '../controllers/courses/submit-assignment.controller.js';
import { submissionUploadMiddleware } from '../middlewares/upload.middleware.js';
import { controller } from "../controllers/generic.controller.js";

const router = Router();

router.get('/', controller(searchCoursesUseCase));
router.get('/:id', getCourseById);
router.post('/:courseId/enroll', controller(enrollCoursesUseCase));
router.get('/:courseId/materials', controller(courseMaterialsQueryUsecase));
router.post('/assignments/:assignmentId/submit', submissionUploadMiddleware, submitAssignment);
router.put('/:courseId', controller(modifyCourseUsecase));

export default router;