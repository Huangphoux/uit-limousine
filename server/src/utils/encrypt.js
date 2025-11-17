import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function generateJWT(id) {
    return jwt.sign({ sub: id }, config.jwt.secret, { expiresIn: "24h" });
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        return { userId: decoded.sub };
    } catch (error) {
        return null;
    }
}