import bcrypt from 'bcrypt';
import { UserEntity } from "../../domain_layer/user.entity.js"

export class RegisterUseCase {
    #userRepository;
    #roleRepository;
    #bcryptConfig;

    constructor(userRepository, roleRepository, bcryptConfig) {
        this.#userRepository = userRepository;
        this.#roleRepository = roleRepository;
        this.#bcryptConfig = bcryptConfig;
    }

    async execute({ email, password, fullname }) {
        const role = await this.#roleRepository.findByName('LEARNER');
        const hashedPassword = await bcrypt.hash(password, this.#bcryptConfig.saltRounds);
        let user = UserEntity.create(email, hashedPassword, fullname);
        user.addRole(role);
        const result = await this.#userRepository.create(user);

        return {
            id: result.id,
            email: result.email,
            fullName: result.name,
            roles: result.roles.map(roleEntity => roleEntity.name),
            emailVerified: false,
            createdAt: result.createdAt,
        };
    }
}