import { UserEntity } from '../../domain_layer/user.entity.js';
import { UserMapper } from '../mapper/user.mapper.js';

export class UserRepositoryPostgree {
    #userModel = null;

    constructor(userModel) {
        this.#userModel = userModel;
    }

    async findByEmail(email) {
        const row = await this.#userModel.findUnique({
            where: { email: email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                roles: true,
            }
        });

        if (row == null)
            return row;

        let user = new UserEntity();
        user.id = row.id;
        user.email = row.email;
        user.password = row.password;
        user.name = row.name;
        user.roles = row.role;
        return user;
    }

    async create(user) {
        const row = await this.#userModel.create({
            data: UserMapper.toPersistence(user),
            include: { roles: { include: { role: true } } },
        });
        return UserMapper.toDomain(row);
    }
}