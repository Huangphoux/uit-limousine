import { verifyToken } from '../../utils/encrypt.js';

export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'No token provided'
                }
            });
        }

        const decoded = verifyToken(token);
        
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid token'
                }
            });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: {
                message: 'Invalid or expired token'
            }
        });
    }
};
