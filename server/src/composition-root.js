import { PrismaClient } from "@prisma/client";
import { config } from "./config.js"

import { LoginController } from "./presentation_layer/controllers/login.controller.js";
import { LoginUseCase } from "./application_layer/login.usecase.js";
import { UserRepositoryPostgree } from "./infrustructure_layer/user.repository.postgree.js";
import { TokenRepositoryPostgree } from "./infrustructure_layer/token.repository.postgree.js";

import { LogoutController } from "./presentation_layer/controllers/logout.controller.js";
import { LogoutUseCase } from "./application_layer/logout.usecase.js";

export const prisma = new PrismaClient();

const userRepository = new UserRepositoryPostgree(prisma.user);
const tokenRepository = new TokenRepositoryPostgree(prisma.token);
const loginUseCase = new LoginUseCase(userRepository, tokenRepository, config.jwt);
export const loginController = new LoginController(loginUseCase);

const logoutUseCase = new LogoutUseCase(tokenRepository);
export const logoutController = new LogoutController(logoutUseCase);