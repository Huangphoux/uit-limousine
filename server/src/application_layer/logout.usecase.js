export class LogoutUseCase
{
    static get LOGIN_ERROR_MESSAGE() { return "Invalid email or password"; }

    constructor(tokenRepository)
    {
        this.tokenRepository = tokenRepository;
    }

    async execute({ token })
    {        
        await this.tokenRepository.remove(token);
        return true;
    }
}