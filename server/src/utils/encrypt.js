import jwt from "jsonwebtoken";
import z from "zod";
import bcrypt from "bcrypt";
// import { config } from "../config.js";

const secret = "config.jwt.secret"

export const bearerTokenHeaderSchema = z.string().regex(
    /^Bearer\s+[\w-]+\.[\w-]+\.[\w-]+$/,
    "Invalid Bearer token format"
);

export const authenticationTokenSchema = z.object({
    id: z.string(),
    roles: z.array(z.number()),
});

export function generateJWT(payload) {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export function verifyJwt(token) {
    return jwt.verify(token, secret);
}

export function hashPassword(password, salt) {
    return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}