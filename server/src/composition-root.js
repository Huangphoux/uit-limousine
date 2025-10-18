import { LoginController } from "./presentation_layer/controllers/login.controller";
import { LoginUseCase } from "./application_layer/login.usecase";
import { UserRepositoryPostgree } from "./infrustructure_layer/user.repository.postgree"
import { TokenRepositoryPostgree } from "./infrustructure_layer/token.repository.postgree"

const userRepository = new UserRepositoryPostgree()
const tokenRepository = new TokenRepositoryPostgree()
const loginUseCase = new LoginUseCase(userRepository, tokenRepository)
export const loginController = new LoginController(loginUseCase)