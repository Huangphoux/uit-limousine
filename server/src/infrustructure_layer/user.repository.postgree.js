import { PrismaClient} from '@prisma/client';
import { UserEntity } from '../domain_layer/user.entity.js';
const prisma = new PrismaClient();

export class UserRepositoryPostgree
{
    async findByEmail(email)
    {
        const row = await prisma.user.findUnique({
             where: { email : email }
        });
        return row ? new UserEntity(row.id, row.email, row.password) : null;
    }
}