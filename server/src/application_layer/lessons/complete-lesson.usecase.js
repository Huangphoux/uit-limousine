import z from "zod";

const inputShema = z.object({
    authId: z.string(),
    lessonId: z.string(),
})

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
    constructor(userRepository, lessonProgressRepository) {
        this.userRepository = userRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    async execute(input) {
        let user = await this.userRepository.findById(input.userId);
        if (!user) throw Error(`User not found, ${input.userId}`);

        let lessonProgress = await this.lessonProgressRepository.findByPairId(input.userId, input.lessonId);
        if (!lessonProgress) throw Error(`User has not learnt yet, ${input.lessonId}`);

        lessonProgress.complete();

        let savedLessonProgress = await this.lessonProgressRepository.save(lessonProgress);

        return CompleteLessonUseCaseOutput.create(savedLessonProgress, "Deo hieu thiet ke api kieu gi luon ???");
    }
}