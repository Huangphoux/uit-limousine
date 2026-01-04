import { Router } from "express";
import { uploadImage, downloadImage } from "../controllers/media.controller.js";

const router = Router();

router.post("/upload", (req, res) => uploadImage(req, res));
router.get("/download/:fileId", (req, res) => downloadImage(req, res));

export default router;
