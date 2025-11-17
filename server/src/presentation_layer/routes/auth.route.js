import { Router } from "express";
import { loginController, logoutController, registerController } from "../../composition-root.js";
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', async (req, res) => { await loginController.execute(req, res); });
router.post('/logout', authenticateToken, async (req, res) => { await logoutController.execute(req, res) });
router.post('/register', async (req, res) => { await registerController.execute(req, res) });

export default router;