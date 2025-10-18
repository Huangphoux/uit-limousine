import { UserEntity } from '../domain_layer/user.entity.js';

export class UserRepositoryPostgree {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async findByEmail(email) {
        const row = await this.userModel.findUnique({
            where: { email: email }
        });
        return row ? new UserEntity(row.id, row.email, row.password) : null;
    }
}