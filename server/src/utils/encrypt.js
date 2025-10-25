import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function generateJWT(id) {
    return jwt.sign({ sub: id }, config.jwt.secret, { expiresIn: config.jwt.expiry });
}