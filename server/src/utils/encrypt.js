import jwt from "jsonwebtoken";
import z from "zod";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { config } from "../config.js";

export const bearerTokenHeaderSchema = z.string().regex(
    /^Bearer\s+[\w-]+\.[\w-]+\.[\w-]+$/,
    "Invalid Bearer token format"
);

export const authenticationTokenSchema = z.object({
    id: z.string(),
    roles: z.array(z.number()),
});

export function generateJWT(payload, expiry = config.jwt.expiry) {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: expiry });
}

export function verifyJwt(token) {
    return jwt.verify(token, config.jwt.secret);
}

export function generateSalt() {
    return bcrypt.genSaltSync(config.bcrypt.saltRounds);
}

export function hashPassword(password, salt) {
    return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

export function generateUUID() {
    return randomUUID();
}