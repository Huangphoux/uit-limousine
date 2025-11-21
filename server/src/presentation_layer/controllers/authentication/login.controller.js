export class LoginController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    async execute(req, res) {
        try {
            console.log(`Call POST /auth/login`);

            const result = await this.loginUseCase.execute(req.body);
            res.jsend.success(result);

            console.log(`Return POST /auth/login`);
        }
        catch (error) {
            res.status(400).jsend.fail(error.message);
        }
    }
}