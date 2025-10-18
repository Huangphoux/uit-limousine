import { Router } from "express";
import { LoginController } from "../controllers/login.controller.js";

export function createLoginRouter(loginUseCase) {
  const router = express.Router();
  const loginController = new LoginController(loginUseCase);
  router.post("/login", async (req, res) => {
    await loginController.login(req, res);
  });
  return router;
}

const router = Router()

export default router;