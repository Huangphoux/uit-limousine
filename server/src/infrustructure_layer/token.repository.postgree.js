export class TokenRepositoryPostgree {
    constructor(tokenModel) {
        this.tokenModel = tokenModel;
    }

    async add(token) {
        return await this.tokenModel.create({
            data: { token: token.token, userId: token.userId }
        });
    }

    async remove(tokenString) {
        return await this.tokenModel.delete({ where: { token: tokenString } });
    }
}