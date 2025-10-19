import { RoleMapper } from '../mapper/role.mapper.js';

export class RoleRepositoryPostgree {
    #roleModel;

    constructor(roleModel) {
        this.#roleModel = roleModel;
    }

    async findByName(name) {
        const row = await this.#roleModel.findUnique({
            where: { name: name },
            select: { id: true, name: true },
        });

        return RoleMapper.toDomain(row);
    }
}