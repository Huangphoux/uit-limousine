import bcrypt from "bcrypt";
import { ERROR_CATALOG } from "../../../constants/errors.js";
import { generateJWT } from "../../utils/encrypt.js";

export class LoginUseCase {
    constructor(userRepository, tokenRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    async execute({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error(ERROR_CATALOG.LOGIN.message);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error(ERROR_CATALOG.LOGIN.message);

        const accessJwt = generateJWT(user.id);

        return {
            accessToken: accessJwt,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.name,  // Map name to fullName for API response
                roles: user.roles.map(role => role.name),
            }
        };
    }
}