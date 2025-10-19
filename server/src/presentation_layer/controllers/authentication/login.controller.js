import { ERROR_CATALOG } from '../../../../constants/errors.js';

export class LoginController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    async execute(req, res) {
        try {
            const result = await this.loginUseCase.execute(req.body);
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
        catch (error) {
            res.status(ERROR_CATALOG.LOGIN.status).json({ message: error.message });
        }
    }
}