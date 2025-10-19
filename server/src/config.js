import dotenv from "dotenv";

dotenv.config();

export const config = {
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpiry: process.env.JWT_ACCESS_EXPIRY,
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY,
    }
}