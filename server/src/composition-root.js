import { config } from "./config.js"

import { LoginController } from "./presentation_layer/controllers/login.controller.js";
import { LoginUseCase } from "./application_layer/login.usecase.js";
import { UserRepositoryPostgree } from "./infrustructure_layer/user.repository.postgree.js"
import { TokenRepositoryPostgree } from "./infrustructure_layer/token.repository.postgree.js"

const userRepository = new UserRepositoryPostgree()
const tokenRepository = new TokenRepositoryPostgree()
const loginUseCase = new LoginUseCase(userRepository, tokenRepository, config.jwt.secret, config.jwt.expiry)
export const loginController = new LoginController(loginUseCase)

console.log(config.jwt.secret)