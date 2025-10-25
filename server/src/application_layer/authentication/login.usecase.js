import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ERROR_CATALOG } from "../../../constants/errors.js";

export class LoginUseCase {
    constructor(userRepository, tokenRepository, jwtConfig) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.jwtConfig = jwtConfig;
    }

    async execute({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error(ERROR_CATALOG.LOGIN.message);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error(ERROR_CATALOG.LOGIN.message);

        const accessJwt = jwt.sign({ sub: user.id }, this.jwtConfig.secret, { expiresIn: this.jwtConfig.accessExpiry });

        return {
            accessToken: accessJwt,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            }
        };
    }
}