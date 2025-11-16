import { CompleteLessonUseCaseInput } from "../../../application_layer/lessons/complete-lesson.usecase.js";

export class CompleteLessonController {
    #useCase;

    constructor(useCase) {
        this.#useCase = useCase;
    }

    async execute(req, res) {
        try {
            console.log(`Call POST /lessons/${req.params.lessonId}/complete`);

            let input = new CompleteLessonUseCaseInput();
            input.userId = req.body.userId;
            input.lessonId = req.params.lessonId;

            const result = await this.#useCase.execute(input);
            res.json({
                success: true,
                data: result,
            })

            console.log(`Return POST /lessons/${req.params.lessonId}/complete`)
        }
        catch (error) {
            console.error(error.message);
            res.json({ message: error.message });
        }
    }
}