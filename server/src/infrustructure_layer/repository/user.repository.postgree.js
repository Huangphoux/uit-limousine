import { UserEntity } from '../../domain_layer/user.entity.js';
import { UserMapper } from '../mapper/user.mapper.js';

export class UserRepositoryPostgree {
    #userModel = null;

    constructor(userModel) {
        this.#userModel = userModel;
    }

    async findById(id) {
        const row = await this.#userModel.findUnique({
            where: { id: id },
            select: UserRepositoryPostgree.baseQuery
        });

        return UserMapper.toDomain(row);
    }

    async findByEmail(email) {
        const row = await this.#userModel.findUnique({
            where: { email },
            select: UserRepositoryPostgree.baseQuery
        });

        return UserMapper.toDomain(row);
    }

    async create(user) {
        const row = await this.#userModel.create({
            data: UserMapper.toPersistence(user),
            select: UserRepositoryPostgree.baseQuery
        });

        return UserMapper.toDomain(row);
    }

    static baseQuery = {
        id: true,
        email: true,
        password: true,
        name: true,
        roles: {
            select: { role: true }
        },
    }
}