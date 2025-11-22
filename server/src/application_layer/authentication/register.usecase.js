import bcrypt from 'bcrypt';
import { UserEntity } from "../../domain_layer/user.entity.js";
import { generateJWT } from '../../utils/encrypt.js';
import { ERROR_CATALOG } from '../../../constants/errors.js';

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
        const registeredEmail = await this.#userRepository.findByEmail(email);
        if (registeredEmail != null) throw Error(ERROR_CATALOG.REGISTER.message);

        const role = await this.#roleRepository.findByName('LEARNER');
        if (!role) throw Error("The default role does not exist in the database");

        const hashedPassword = await bcrypt.hash(password, this.#bcryptConfig.saltRounds);

        let user = UserEntity.create(email, hashedPassword, fullname);
        user.addRole(role);

        const result = await this.#userRepository.create(user);

        const accessJwt = generateJWT({ id: user.id, roles: user.roles.map(r => r.name) });

        return {
            accessToken: accessJwt,
            user: {
                id: result.id,
                email: result.email,
                fullName: result.name,
                roles: result.roles.map(roleEntity => roleEntity.name),
            }
        };
    }
}