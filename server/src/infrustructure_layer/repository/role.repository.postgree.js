import { RoleEntity } from '../../domain_layer/role.entity.js';

export class RoleRepositoryPostgree {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async findByName(name) {
        const row = await this.prisma.role.findUnique({
            where: { name: name },
            select: { id: true, name: true },
        });

        return RoleEntity.rehydrate(row);
    }
}