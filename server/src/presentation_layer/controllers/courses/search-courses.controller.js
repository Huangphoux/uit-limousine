export class SearchCoursesController {
    #useCase;

    constructor(useCase) {
        this.#useCase = useCase;
    }

    async execute(req, res) {
        try {
            const result = await this.#useCase.execute(req.query);
            res.json({
                success: true,
                data: result,
            })
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}