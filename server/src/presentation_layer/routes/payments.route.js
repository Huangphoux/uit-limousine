import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";
import { checkout } from "../controllers/payments.controller.js";

const router = Router();

router.post("/checkout", authenticationMiddleware, (req, res) => checkout(req, res));

export default router;
