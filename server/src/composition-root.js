import { PrismaClient } from "@prisma/client";

import { config } from "./config.js"
import { LoginController } from "./presentation_layer/controllers/login.controller.js";
import { LoginUseCase } from "./application_layer/login.usecase.js";
import { UserRepositoryPostgree } from "./infrustructure_layer/user.repository.postgree.js"
import { TokenRepositoryPostgree } from "./infrustructure_layer/token.repository.postgree.js"

export const prisma = new PrismaClient()

export const userRepository = new UserRepositoryPostgree(prisma.user)
export const tokenRepository = new TokenRepositoryPostgree(prisma.token)
export const loginUseCase = new LoginUseCase(userRepository, tokenRepository, config.jwt)
export const loginController = new LoginController(loginUseCase)