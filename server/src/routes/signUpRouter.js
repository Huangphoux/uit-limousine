import { Router } from 'express';
import createUser from '../controllers/signUpController.js';

const signUpRouter = Router();

signUpRouter.post("/api/sign-up", createUser);

export default signUpRouter;