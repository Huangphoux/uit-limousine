import { Router } from "express";
import {
  approveCourseUseCase,
  courseMaterialsQueryUsecase,
  enrollCoursesUseCase,
  modifyCourseUsecase,
  searchCoursesUseCase,
  unenrollCourseUseCase,
  comprehensiveUpdateCourseUsecase,
} from "../../composition-root.js";
import { getCourseById } from "../controllers/courses/course.controller.js";
import { submitAssignment, getSubmission } from "../controllers/courses/submit-assignment.controller.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { submissionUploadMiddleware } from "../middlewares/upload.middleware.js";
import { controller } from "../controllers/generic.controller.js";
import { roleAuthorizationMiddleware } from "../middlewares/role-authorization.middleware.js";

const router = Router();

router.get("/", authenticationMiddleware, controller(searchCoursesUseCase));
router.get("/:id", authenticationMiddleware, getCourseById);
router.post("/:courseId/enroll", authenticationMiddleware, controller(enrollCoursesUseCase));
router.post("/:courseId/unenroll", authenticationMiddleware, controller(unenrollCourseUseCase));

router.get(
  "/:courseId/materials",
  authenticationMiddleware,
  controller(courseMaterialsQueryUsecase)
);
router.post("/assignments/:assignmentId/submit", submissionUploadMiddleware, authenticationMiddleware, submitAssignment);
router.get("/assignments/:assignmentId/submission", authenticationMiddleware, getSubmission);
router.put("/:courseId", authenticationMiddleware, controller(comprehensiveUpdateCourseUsecase));
// Router


export default router;
