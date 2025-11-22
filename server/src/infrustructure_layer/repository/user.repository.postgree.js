import { UserMapper } from '../mapper/user.mapper.js';
import { logger } from '../../utils/logger.js';

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

    async save(user) {
        logger.debug('Saving user', { userId: user.id, userData: user });

        try {
            const row = await this.#userModel.update({
                where: { id: user.id },
                data: UserMapper.toPersistence(user),
                select: UserRepositoryPostgree.baseQuery,
            });

            const domainUser = UserMapper.toDomain(row);

            logger.info('User saved successfully', { userId: domainUser.id });
            return domainUser;
        } catch (error) {
            logger.error('Failed to save user', {
                userId: user.id,
                error_message: error.message,
                stack_trace: error.stack,
            });
            throw error;
        }
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