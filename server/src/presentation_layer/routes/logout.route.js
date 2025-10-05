import express from 'express';
import { LogoutController } from '../controllers/logout.controller.js';

export function createLogoutRouter(logoutUseCase)
{
    
    const router = express.Router();
    const logoutController = new LogoutController(logoutUseCase);
    router.post('/logout', async (req, res) => {        
        await logoutController.logout(req, res)
    });
    return router;
}