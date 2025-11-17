import { SUCCESS_CATALOG } from "../../../../constants/messages.js";

export class RegisterController {
    #useCase;

    constructor(useCase) {
        this.#useCase = useCase;
    }

    async execute(req, res) {
        try {
            const result = await this.#useCase.execute(req.body);
            res.status(201).json({
                success: true,
                data: result,
                message: SUCCESS_CATALOG.REGISTER.message,
            });
        }
        catch (error) {
            res.status(400).json({ 
                success: false,
                error: {
                    message: error.message 
                }
            });
        }
    }
}