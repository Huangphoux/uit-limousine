import { SUCCESS_CATALOG } from "../../../../constants/messages";

export class LoginController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    async execute(req, res) {
        const result = await this.loginUseCase.execute(req.body);
        res.status(SUCCESS_CATALOG.LOGIN.status);
        res.json({
            success: true,
            data: {
                accessToken: result.token.access,
                refreshToken: result.token.refresh,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    fullName: result.user.name,
                    role: result.user.role,
                }
            }
        });
    }
}