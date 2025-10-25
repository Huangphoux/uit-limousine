export class LoginController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    async execute(req, res) {
        try {
            const result = await this.loginUseCase.execute(req.body);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            res.json({ message: error.message });
        }
    }
}