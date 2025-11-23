export class EnrollCoursesController {
    #useCase;

    constructor(useCase) {
        this.#useCase = useCase;
    }

    async execute(req, res) {
        try {
            console.log(`Call POST /courses/${req.params.courseId}/enroll`);

            let input = {
                ...req.params,
                ...req.body,
            }

            const result = await this.#useCase.execute(input);
            res.json({
                success: true,
                data: result,
            })

            console.log(`Return POST /courses/${req.params.courseId}/enroll`)
        }
        catch (error) {
            console.error(error.message);
            res.json({ message: error.message });
        }
    }
}