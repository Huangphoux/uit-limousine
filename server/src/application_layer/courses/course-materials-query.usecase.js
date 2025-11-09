export class CourseMaterialsQueryUseCaseInput {
    userId;
    courseId;
}

export class CourseMaterialsQueryUseCaseOutput {
    modules;

    static create(modules, progressMap) {
        let result = new CourseMaterialsQueryUseCaseOutput();
        result.modules = modules.map(module => ModuleOutput.create(module, progressMap));
        return result;
    }
}

class ModuleOutput {
    id;
    title;
    lessons;

    static create(module, progressMap) {
        let result = new LessonOutput();
        result.id = module.id;
        result.title = module.title;
        result.lessons = module.lessons.map(lesson => LessonOutput.create(lesson, progressMap));
        return result;
    }
}

class LessonOutput {
    id;
    title;
    type;
    content;
    duration;
    order;
    isCompleted;

    static create(lesson, progressMap) {
        result = new LessonOutput();
        result.id = lesson.id;
        result.title = lesson.title;
        result.type = lesson.contentType;
        result.content = lesson.mediaUrl;
        result.duration = lesson.durationSec;
        result.order = lesson.position;

        let progress = progressMap.get(lesson.id);
        let progressValue = progress ? progress : 0;
        result.isCompleted = progressValue == 1.0;

        return result;
    }
}

export class CourseMaterialsQueryUseCase {
    constructor(courseReadAccessor, userReadAccessor) {
        this.courseReadAccessor = courseReadAccessor;
        this.userReadAccessor = userReadAccessor;
    }

    async execute(input) {
        const courseMaterials = await this.courseReadAccessor.getCourseMaterials(input.courseId);
        const lessonProgresses = await this.userReadAccessor.getLessonProgresses(input.userId);
        const progressMap = new Map(lessonProgresses.map(p => [p.id, p.progress]));
        return CourseMaterialsQueryUseCaseOutput.create(courseMaterials, progressMap);
    }
}