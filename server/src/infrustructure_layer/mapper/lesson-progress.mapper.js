import { LessonProgressEntity } from "../../domain_layer/lesson-progress.entity";

export class LessonProgressMapper {
    static toPersistence(entity) {
        return {
            progress: entity.progress,
            completedAt: entity.completedAt,
        };
    }

    static toDomain(raw) {
        if (!raw) return raw;

        let entity = LessonProgressEntity.create(raw.id, raw.userId, raw.lessonId);
        entity.progress = raw.progress;
        entity.completedAt = raw.completedAt;
        return entity;
    }
}