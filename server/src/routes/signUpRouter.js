import { Router } from 'express';
import createUser from '../controllers/signUpController';

const signUpRouter = Router();

signUpRouter.post("/api/sign-up", createUser);

export default signUpRouter;