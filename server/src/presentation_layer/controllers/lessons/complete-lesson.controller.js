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
            input.userId = req.userId; // from auth middleware
            input.lessonId = req.params.lessonId;

            const result = await this.#useCase.execute(input);
            res.status(200).json({
                success: true,
                data: result,
            })

            console.log(`Return POST /lessons/${req.params.lessonId}/complete`)
        }
        catch (error) {
            console.error('Complete lesson error:', error);
            res.status(400).json({ 
                success: false,
                error: {
                    message: error.message || String(error)
                }
            });
        }
    }
}