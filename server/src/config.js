import dotenv from "dotenv";

dotenv.config();

export const config = {
    jwt: {
        secret: "fake-secret", //process.env.JWT_SECRET,
        expiry: "1h", //process.env.JWT_EXPIRY,
    },
    bcrypt: {
        saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),
    }
}