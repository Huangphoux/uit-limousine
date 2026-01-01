import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { upload } from "../middlewares/resource-upload.middleware.js";
import { uploadFilesController } from "../controllers/uploads.controller.js";

const router = Router();

// Upload temporary files (stored in GridFS) and return fileIds
router.post("/files", authenticationMiddleware, upload.array("files"), uploadFilesController);

export default router;
