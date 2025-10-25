import bcrypt from "bcrypt";
import { config } from "../../../src/config.js";

export const email = 'login';
export const password = 'login';

export async function createUserData() {
    return {
        email: email,
        password: await bcrypt.hash(password, config.bcrypt.saltRounds),
    }
}