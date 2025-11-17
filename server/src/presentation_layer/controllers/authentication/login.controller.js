export class LoginController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    async execute(req, res) {
        try {
            const result = await this.loginUseCase.execute(req.body);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            res.status(401).json({ 
                success: false,
                error: {
                    message: error.message 
                }
            });
        }
    }
}