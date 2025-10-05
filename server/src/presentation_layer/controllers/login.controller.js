export class LoginController
{
    static get LOGIN_MESSAGE() { return 'Login successful'; }

    constructor(loginUseCase)
    {
        this.loginUseCase = loginUseCase;
    }

    async login(req, res)
    {
        try
        {
            const result = await this.loginUseCase.execute(req.body);  
            res.json({ token: result });            
        }
        catch (error)
        {
            res.status(401).json({ message: error.message });
        }
    }
}