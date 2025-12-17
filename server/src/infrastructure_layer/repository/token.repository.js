export class TokenRepository {
    constructor(client) {
        this.client = client;
    }

    async add(tokenId, userId) {
        await this.client.resetToken.create({
            data: { tokenId, userId },
            select: { id: true }
        })
    }

    async exist(tokenId, userId) {
        const count = await this.client.resetToken.count({
            where: {
                tokenId, userId
            }
        });
        return count === 1;
    }

    async delete(tokenId) {
        await this.client.resetToken.deleteMany({
            where: {
                tokenId,
            }
        });
    }
}