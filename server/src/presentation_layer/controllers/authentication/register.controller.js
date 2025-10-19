import { ERROR_CATALOG } from "../../../../constants/errors.js";
import { SUCCESS_CATALOG } from "../../../../constants/messages.js";

export class RegisterController {
    #useCase;

    constructor(useCase) {
        this.#useCase = useCase;
    }

    async execute(req, res) {
        try {
            const result = await this.#useCase.execute(req.body);
            res.status(SUCCESS_CATALOG.REGISTER.status);
            res.json({
                success: true,
                data: result,
                message: SUCCESS_CATALOG.REGISTER.message,
            });
        }
        catch (error) {
            res.status(ERROR_CATALOG.REGISTER.status).json({ message: error.message });
        }
    }
}