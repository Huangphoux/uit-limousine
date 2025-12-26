import z from "zod";
import { LessonProgressEntity } from "../../domain_layer/lesson-progress.entity.js";
import { logger } from "../../utils/logger.js";

const inputSchema = z.object({
    authId: z.string(),
    lessonId: z.string(),
})

const outputSchema = z.object({
    lessonId: z.string(),
    completedAt: z.date().nullable(),
    progress: z.number(),
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
        const log = logger.child({
            task: "Toggling lesson complete status",
            studentId: parsedInput.authId,
        });
        log.info("Task started");

        const course = await this.courseRepository.findByLessonId(parsedInput.lessonId);
        if (!course) {
            log.warn("Task failed: invalid lesson id");
            throw Error(`Course not found`);
        }

        const isEnrolled = await this.enrollmentReadAccess.isEnrolled(parsedInput.authId, course.id);
        if (!isEnrolled) {
            log.warn("Task failed: unenrolled course");
            throw Error(`User has not enrolled the course`);
        }

        let lessonProgress = await this.lessonProgressRepository.findByUserAndLessonId(parsedInput.authId, parsedInput.lessonId);
        let savedLessonProgress = null;
        
        if (!lessonProgress) {
            // Lesson not started yet - create and mark as complete
            lessonProgress = LessonProgressEntity.create({ userId: parsedInput.authId, lessonId: parsedInput.lessonId });
            lessonProgress.complete();
            savedLessonProgress = await this.lessonProgressRepository.add(lessonProgress);
        }
        else {
            // Toggle: if complete, mark undone; if not complete, mark done
            if (lessonProgress.progress >= 1.0) {
                lessonProgress.uncomplete();
            } else {
                lessonProgress.complete();
            }
            savedLessonProgress = await this.lessonProgressRepository.save(lessonProgress);
        }

        const courseLessonIds = course.modules.flatMap((m) =>
            m.lessons.map((l) => l.id)
        );
        const completeCount = await this.lessonProgressReadAccessor.countComplete(courseLessonIds);
        const courseProgress = courseLessonIds.length
            ? completeCount / courseLessonIds.length * 100
            : 0;

        log.info("Task completed");
        return outputSchema.parse({
            lessonId: savedLessonProgress.lessonId,
            completedAt: savedLessonProgress.completedAt,
            progress: savedLessonProgress.progress,
            courseProgress,
        });
    }
}