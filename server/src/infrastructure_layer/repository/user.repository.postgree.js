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
    async findRoleByName(name) {
        return await this.prisma.role.findUnique({
            where: { name: name }
        });
    }

    async findByEmail(email) {
        const raw = await this.prisma.user.findUnique({
            where: { email },
            select: UserRepositoryPostgree.baseQuery
        });

        return UserEntity.rehydrate(raw);
    }

    // Trong UserRepositoryPostgree.js
    async add(user) {
        console.log("Dữ liệu user vào Repo:", JSON.stringify(user, null, 2));

        const raw = await this.prisma.user.create({
            data: {
                ...toPersistence(user, false),
                roles: {
                    create: (user.roles || [])
                        .filter(r => r !== null)
                        .map(r => {
                            // Lấy giá trị ID từ bất cứ field nào có dữ liệu
                            const rid = r.roleId;
                            return {
                                roleId: typeof rid === 'string' ? parseInt(rid) : rid
                            };
                        })
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
                    // Xóa các role không còn nằm trong danh sách user.roles
                    deleteMany: {
                        roleId: { notIn: user.roles.map(r => r.id) }
                    },
                    // Tạo hoặc kết nối các role có trong danh sách
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

    async delete(id) {
        await this.prisma.user.delete({
            where: { id: id }
        });
    }

    static baseQuery = buildQuery(userSchema);
}