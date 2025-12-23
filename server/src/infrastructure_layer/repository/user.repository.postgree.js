import { buildQuery } from '../../utils/query-builder.js';
import { UserEntity, userSchema } from '../../domain_layer/user.entity.js';
import { toPersistence } from '../../domain_layer/domain_service/factory.js';

export class UserRepositoryPostgree {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async findById(id) {
        const raw = await this.prisma.user.findUnique({
            where: { id: id },
            select: UserRepositoryPostgree.baseQuery
        });

        return UserEntity.rehydrate(raw);
    }

    async findByEmail(email) {
        const raw = await this.prisma.user.findUnique({
            where: { email },
            select: UserRepositoryPostgree.baseQuery
        });

        return UserEntity.rehydrate(raw);
    }

    async add(user) {
        const raw = await this.prisma.user.create({
            data: {
                ...toPersistence(user, false),
                roles: {
                    create: user.roles.map(r => ({
                        roleId: r.id,
                    }))
                }
            },
            select: UserRepositoryPostgree.baseQuery
        });

        return UserEntity.rehydrate(raw);
    }

    async save(user) {
        const raw = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                ...toPersistence(user, false),
                roles: {
                    connectOrCreate: user.roles.map(r => ({
                        where: {
                            userId_roleId: {
                                userId: user.id,
                                roleId: r.id,
                            }
                        },
                        create: {
                            roleId: r.id,
                        }
                    }))
                }
            },
            select: UserRepositoryPostgree.baseQuery,
        });

        const domainUser = UserEntity.rehydrate(raw);

        return domainUser;
    }

    static baseQuery = buildQuery(userSchema);
}