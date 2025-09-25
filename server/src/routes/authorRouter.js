// routes/authorRouter.js
import { Router } from "express";
import { getAuthorById } from '../controllers/authorController.js';

const authorRouter = Router();

authorRouter.get("/:authorId", getAuthorById);

export default authorRouter;
