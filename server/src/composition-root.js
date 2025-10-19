import { PrismaClient } from "@prisma/client";
import { config } from "./config.js"

import { LoginController } from "./presentation_layer/controllers/authentication/login.controller.js";
import { LoginUseCase } from "./application_layer/authentication/login.usecase.js";
import { UserRepositoryPostgree } from "./infrustructure_layer/repository/user.repository.postgree.js";
import { TokenRepositoryPostgree } from "./infrustructure_layer/repository/token.repository.postgree.js";

import { LogoutController } from "./presentation_layer/controllers/authentication/logout.controller.js";
import { LogoutUseCase } from "./application_layer/authentication/logout.usecase.js";

import { RegisterController } from "./presentation_layer/controllers/authentication/register.controller.js";
import { RegisterUseCase } from "./application_layer/authentication/register.usecase.js";
import { RoleRepositoryPostgree } from "./infrustructure_layer/repository/role.repository.postgree.js";

export const prisma = new PrismaClient();

const userRepository = new UserRepositoryPostgree(prisma.user);
const tokenRepository = new TokenRepositoryPostgree(prisma.token);
const loginUseCase = new LoginUseCase(userRepository, tokenRepository, config.jwt);
export const loginController = new LoginController(loginUseCase);

const logoutUseCase = new LogoutUseCase(tokenRepository);
export const logoutController = new LogoutController(logoutUseCase);

const roleRepository = new RoleRepositoryPostgree(prisma.role);
const registerUseCase = new RegisterUseCase(userRepository, roleRepository);
export const registerController = new RegisterController(registerUseCase);