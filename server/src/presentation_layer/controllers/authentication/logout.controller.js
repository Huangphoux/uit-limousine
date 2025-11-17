import { SUCCESS_CATALOG } from '../../../../constants/messages.js'
import { ERROR_CATALOG } from '../../../../constants/errors.js';

export class LogoutController {
    constructor(logoutUseCase) {
        this.logoutUseCase = logoutUseCase;
    }

    async execute(req, res) {
        try {
            // Stateless logout - just return success
            // Client should delete the token
            res.status(200).json({
                success: true,
                message: SUCCESS_CATALOG.LOGOUT.message,
            });
        }
        catch (error) {
            res.status(ERROR_CATALOG.LOGOUT.status).json({ 
                success: false,
                error: {
                    message: error.message 
                }
            });
        }
    }
}