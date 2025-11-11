import jwt from "jsonwebtoken";
import { config } from "../../config.js";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                code: "UNAUTHORIZED",
                message: "Access token is required"
            }
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.userId = decoded.sub; // Extract user ID from token's sub claim
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: {
                code: "INVALID_TOKEN",
                message: "Invalid or expired token"
            }
        });
    }
}
