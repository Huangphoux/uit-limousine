import { LessonProgressEntity } from "../../domain_layer/lesson-progress.entity.js";

export class CompleteLessonUseCaseInput {
    userId;
    lessonId;
}

export class CompleteLessonUseCaseOutput {
    lessonId;
    completedAt;
    courseProgress;

    static create(lessonProgress, courseProgress) {
        let result = new CompleteLessonUseCaseOutput();
        result.lessonId = lessonProgress.lessonId;
        result.completedAt = lessonProgress.completedAt;
        result.courseProgress = courseProgress;

        return result;
    }
}

export class CompleteLessonUseCase {
    #userRepository
    #lessonProgressRepository;

    constructor(userRepository, lessonProgressRepository) {
        this.#userRepository = userRepository;
        this.#lessonProgressRepository = lessonProgressRepository;
    }

    async execute(input) {
        let user = await this.#userRepository.findById(input.userId);
        if (!user) throw Error(`User not found, ${input.userId}`);

        let lessonProgress = await this.#lessonProgressRepository.findByPairId(input.userId, input.lessonId);
        
        // If lesson progress doesn't exist, create it
        if (!lessonProgress) {
            let newProgress = LessonProgressEntity.create(null, input.userId, input.lessonId);
            newProgress.complete(); // Mark as complete
            lessonProgress = await this.#lessonProgressRepository.create(newProgress);
        } else {
            lessonProgress.complete();
            lessonProgress = await this.#lessonProgressRepository.save(lessonProgress);
        }

        return CompleteLessonUseCaseOutput.create(lessonProgress, "100%");
    }
}