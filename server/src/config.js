import dotenv from "dotenv";

dotenv.config();

export const config = {
    jwt: {
        secret: process.env.JWT_SECRET,
        expiry: process.env.JWT_EXPIRY
    }
}