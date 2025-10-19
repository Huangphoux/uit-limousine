export class LogoutUseCase {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    async execute({ token }) {
        await this.tokenRepository.remove(token);
        return true;
    }
}