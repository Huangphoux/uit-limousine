import { Router } from "express";
import {
  courseMaterialsQueryUsecase,
  enrollCoursesUseCase,
  modifyCourseUsecase,
  searchCoursesUseCase,
} from "../../composition-root.js";
import { getCourseById } from "../controllers/courses/course.controller.js";
import { submitAssignment } from "../controllers/courses/submit-assignment.controller.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { controller } from "../controllers/generic.controller.js";

const router = Router();

router.get("/", controller(searchCoursesUseCase));
router.get("/:id", getCourseById);
router.post("/:courseId/enroll", authenticationMiddleware, controller(enrollCoursesUseCase));
router.get(
  "/:courseId/materials",
  authenticationMiddleware,
  controller(courseMaterialsQueryUsecase)
);
router.post("/assignments/:assignmentId/submit", authenticationMiddleware, submitAssignment);
router.put("/:courseId", authenticationMiddleware, controller(modifyCourseUsecase));

export default router;
