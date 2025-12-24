import dotenv from "dotenv";

dotenv.config();

export const config = {
    jwt: {
        secret: process.env.JWT_SECRET,
        expiry: process.env.JWT_EXPIRY,
    },
    bcrypt: {
        saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),
    },
    frontend: {
        url: process.env.FRONTEND_URL,
    },
    token: {
        expiry: process.env.TOKEN_EXPIRY,
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    upload: {
        maxFileSize: 20 * 1024 * 1024,
        uploadDir: process.env.UPLOAD_DIR || 'uploads',
    }
}