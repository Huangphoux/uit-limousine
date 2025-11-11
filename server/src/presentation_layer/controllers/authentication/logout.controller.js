import { SUCCESS_CATALOG } from '../../../../constants/messages.js'
import { ERROR_CATALOG } from '../../../../constants/errors.js';

export class LogoutController {
    constructor(logoutUseCase) {
        this.logoutUseCase = logoutUseCase;
    }

    async execute(req, res) {
        try {
            // Extract token from Authorization header
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
            
            await this.logoutUseCase.execute({ token });
            res.json({
                success: true,
                message: SUCCESS_CATALOG.LOGOUT.message,
            });
        }
        catch (error) {
            res.status(ERROR_CATALOG.LOGOUT.status).json({ message: error.message });
        }
    }
}