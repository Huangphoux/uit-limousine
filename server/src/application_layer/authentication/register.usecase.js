import bcrypt from 'bcrypt';
import { UserEntity } from "../../domain_layer/user.entity.js";
import { generateJWT, generateSalt, hashPassword } from '../../utils/encrypt.js';
import { ERROR_CATALOG } from '../../../constants/errors.js';
import z from 'zod';
import { Role } from '../../domain_layer/role.entity.js';

const inputSchema = z.object({
    email: z.string(),
    password: z.string(),
    fullName: z.string(),
})

export const outputSchema = z.object({
    id: z.string(),
    email: z.string(),
    fullName: z.string(),
    role: z.string().default(Role.LEARNER),
    emailVerified: z.boolean().default(false),
    createdAt: z.date(),
})

export class RegisterUseCase {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input)

        const registeredEmail = await this.userRepository.findByEmail(parsedInput.email);
        if (registeredEmail) throw Error(ERROR_CATALOG.REGISTER.message);

        const defaultRole = await this.roleRepository.findByName(Role.LEARNER);
        if (!defaultRole) throw Error(`Role not found`);

        const hashedPassword = hashPassword(parsedInput.password, generateSalt());

        let user = UserEntity.create({ email: parsedInput.email, password: hashedPassword, name: parsedInput.fullName }, defaultRole);

        const savedUser = await this.userRepository.add(user);

        const accessJwt = generateJWT({ id: user.id, roles: user.roles.map(r => r.name) });

        return outputSchema.parse({
            ...savedUser,
            fullName: savedUser.name,
        });
    }
}