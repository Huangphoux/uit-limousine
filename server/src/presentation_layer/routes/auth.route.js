import { Router } from "express";
import { loginController } from "../../composition-root.js";

const router = Router();

router.post('/login', async (req, res) => { await loginController.execute(req, res); });

export default router;