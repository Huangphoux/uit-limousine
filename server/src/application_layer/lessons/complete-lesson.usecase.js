import z from "zod";
import { LessonProgressEntity } from "../../domain_layer/lesson-progress.entity.js";

const inputSchema = z.object({
    authId: z.string(),
    lessonId: z.string(),
})

const outputSchema = z.object({
    lessonId: z.string(),
    completedAt: z.date(),
    courseProgress: z.number(),
})

export class CompleteLessonUseCase {
    constructor(courseRepository, enrollmentReadAccess, lessonProgressRepository, lessonProgressReadAccessor) {
        this.courseRepository = courseRepository;
        this.enrollmentReadAccess = enrollmentReadAccess;
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonProgressReadAccessor = lessonProgressReadAccessor;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        const course = await this.courseRepository.findByLessonId(parsedInput.lessonId);
        if (!course) throw Error(`Course not found`);

        const isEnrolled = await this.enrollmentReadAccess.isEnrolled(parsedInput.authId, course.id);
        if (!isEnrolled) throw Error(`User has not enrolled the course`);

        let lessonProgress = await this.lessonProgressRepository.findByUserAndLessonId(parsedInput.authId, parsedInput.lessonId);
        let savedLessonProgress = null;
        if (!lessonProgress) {
            lessonProgress = LessonProgressEntity.create({ userId: parsedInput.authId, lessonId: parsedInput.lessonId });
            lessonProgress.complete();
            savedLessonProgress = await this.lessonProgressRepository.add(lessonProgress);
        }
        else {
            lessonProgress.complete();
            savedLessonProgress = await this.lessonProgressRepository.save(lessonProgress);
        }

        const courseLessonIds = course.modules.flatMap((m) =>
            m.lessons.map((l) => l.id)
        );
        const completeCount = await this.lessonProgressReadAccessor.countComplete(courseLessonIds);
        const courseProgress = courseLessonIds.length
            ? completeCount / courseLessonIds.length * 100
            : 0;

        return outputSchema.parse({
            lessonId: savedLessonProgress.lessonId,
            completedAt: savedLessonProgress.completedAt,
            courseProgress,
        });
    }
}