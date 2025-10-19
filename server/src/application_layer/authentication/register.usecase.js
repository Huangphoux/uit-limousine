import { UserEntity } from "../../domain_layer/user.entity.js"

export class RegisterUseCase {
    #userRepository;
    #roleRepository;

    constructor(userRepository, roleRepository) {
        this.#userRepository = userRepository;
        this.#roleRepository = roleRepository;
    }

    async execute({ email, password, fullname }) {
        const role = await this.#roleRepository.findByName('LEARNER');
        let user = UserEntity.create(email, password, fullname);
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