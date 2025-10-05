export class LogoutController
{
    static get LOGOUT_MESSAGE() { return 'Logout successfully'; }

    constructor(logoutUseCase)
    {
        this.logoutUseCase = logoutUseCase;
    }

    async logout(req, res)
    {
        try
        {
            await this.logoutUseCase.execute(req.body);
            res.json({ message: LogoutController.LOGOUT_MESSAGE });            
        }
        catch (error)
        {
            res.status(401).json({ message: error.message });
        }
    }
}