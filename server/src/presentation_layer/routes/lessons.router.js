import { Router } from "express";
import { completeLessonUseCase, getLessonResourcesUsecase } from "../../composition-root.js";
import { controller } from "../controllers/generic.controller.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { upload } from "../middlewares/resource-upload.middleware.js";
import { streamResourceController, uploadResourceController, uploadResourcesController } from "../controllers/lesson-resource.controller.js";

const router = Router();

router.post('/:lessonId/complete', authenticationMiddleware, controller(completeLessonUseCase));
// router.post("/:lessonId/resources", authenticationMiddleware, upload.single("files"), uploadResourceController);
router.post("/:lessonId/resources", authenticationMiddleware, upload.array("files"), uploadResourcesController);
router.get("/:lessonId/resources/:resourceId", streamResourceController);

export default router;