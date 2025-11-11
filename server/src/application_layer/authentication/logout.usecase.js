export class LogoutUseCase {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    async execute({ token }) {
        // For stateless JWT, we don't need to delete tokens from database
        // The client should simply discard the token
        // If tokens were stored in DB, we would delete them here:
        // await this.tokenRepository.remove(token);
        return true;
    }
}