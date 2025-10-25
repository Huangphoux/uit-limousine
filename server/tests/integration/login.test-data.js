import bcrypt from "bcrypt";
import { config } from "../../src/config.js";

const email = 'login';
const password = 'login';

export async function createUserData() {
    return {
        email: email,
        password: await bcrypt.hash(password, config.bcrypt.saltRounds),
    }
}

export const userSignInData = {
    email: email,
    password: password,
}