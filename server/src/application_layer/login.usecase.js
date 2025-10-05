import jwt from "jsonwebtoken";
import { TokenEntity } from "../domain_layer/token.entity.js";

export class LoginUseCase
{
    static get LOGIN_ERROR_MESSAGE() { return "Invalid email or password"; }

    constructor(userRepository, tokenRepository, jwtSecret, jwtExpiry = '1h')
    {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.jwtSecret = jwtSecret;
        this.jwtExpiry = jwtExpiry;
    }

    async execute({ email, password})
    {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error(LoginUseCase.LOGIN_ERROR_MESSAGE);
        
        const isPasswordValid = user.matchPassword(password);
        if (!isPasswordValid) throw new Error(LoginUseCase.LOGIN_ERROR_MESSAGE);

        const jwtToken = jwt.sign({ userId: user.id, email: user.email }, this.jwtSecret, { expiresIn: this.jwtExpiry });
        const token = new TokenEntity(jwtToken, user.id);
        await this.tokenRepository.add(token);

        return jwtToken;
    }
}