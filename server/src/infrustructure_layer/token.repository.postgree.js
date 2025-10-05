import { PrismaClient} from '@prisma/client';
const Prisma = new PrismaClient();

export class TokenRepositoryPostgree
{
    async add(token)
    {
        return await Prisma.token.create({
            data: { token: token.token, userId: token.userId }
        });
    }

    async remove(tokenString)
    {
        return await Prisma.token.delete({ where: { token: tokenString } });
    }
}