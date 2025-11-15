import { CourseMaterialsQueryUseCaseInput } from "../../../application_layer/courses/course-materials-query.usecase";

export class CourseMaterialsQueryController {
    #useCase;

    constructor(useCase) {
        this.#useCase = useCase;
    }

    async execute(req, res) {
        try {
            console.log(`Call GET /courses/${req.params.courseId}/materials`);

            let input = new CourseMaterialsQueryUseCaseInput();
            input.userId = req.body.userId;
            input.courseId = req.params.courseId;

            const result = await this.#useCase.execute(input);
            res.json({
                success: true,
                data: result,
            })

            console.log(`Return GET /courses/${req.params.courseId}/materials`)
        }
        catch (error) {
            console.error(error.message);
            res.json({ message: error.message });
        }
    }
}