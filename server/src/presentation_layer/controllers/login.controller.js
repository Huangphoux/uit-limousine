import { ERROR_CATALOG } from "../../../constants/errors";

export class LoginController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    async execute(req, res) {
        try {
            const result = await this.loginUseCase.execute(req.body);
            res.json({ token: result });
        }
        catch (error) {
            res.status(ERROR_CATALOG.LOGIN.status).json({ message: error.message });
        }
    }
}