import { Router } from "express";
import { uploadImage } from "../controllers/media.controller.js";

const router = Router();

router.post("/upload", (req, res) => uploadImage(req, res));

export default router;
