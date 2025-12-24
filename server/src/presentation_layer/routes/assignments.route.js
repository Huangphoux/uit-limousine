import { Router } from "express";
import {
  createAssignment,
  getAssignmentSubmissions,
} from "../controllers/assignments/assignments.controller.js";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";

const router = Router();

router.post("/", authenticationMiddleware, async (req, res) => {
  return createAssignment(req, res);
});

router.get("/:id/submissions", authenticationMiddleware, async (req, res) => {
  return getAssignmentSubmissions(req, res);
});

export default router;
