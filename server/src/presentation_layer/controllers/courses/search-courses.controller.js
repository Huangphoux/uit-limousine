export class SearchCoursesController {
    #useCase;

    constructor(useCase) {
        this.#useCase = useCase;
    }

    async execute(req, res) {
        try {
            const result = await this.#useCase.execute(req.query);
            res.status(200).json({
                success: true,
                data: result,
            })
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