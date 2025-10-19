import jwt from "jsonwebtoken";
import { ERROR_CATALOG } from "../../../constants/errors.js";
import { TokenEntity } from "../../domain_layer/token.entity.js";

export class LoginUseCase {
    constructor(userRepository, tokenRepository, jwtConfig) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.jwtConfig = jwtConfig;
    }

    async execute({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error(ERROR_CATALOG.LOGIN.message);

        const isPasswordValid = user.matchPassword(password);
        if (!isPasswordValid) throw new Error(ERROR_CATALOG.LOGIN.message);

        const accessTokenString = jwt.sign({ sub: user.id }, this.jwtConfig.secret, { expiresIn: this.jwtConfig.accessExpiry });
        const refreshTokenString = jwt.sign({ sub: user.id }, this.jwtConfig.secret, { expiresIn: this.jwtConfig.refreshExpiry });
        const accessToken = new TokenEntity(accessTokenString, user.id);
        const refreshToken = new TokenEntity(refreshTokenString, user.id);
        await this.tokenRepository.add(accessToken);
        await this.tokenRepository.add(refreshToken);

        return {
            token: {
                access: accessTokenString,
                refresh: refreshTokenString,
            },
            user: user,
        };
    }
}