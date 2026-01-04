import { LessonEntity } from "../../domain_layer/course/lesson.entity.js";

export class LessonMapper {
    static toPersistence(entity) {
        return {
            moduleId: entity.moduleId,
            title: entity.title,
            content: entity.content,
            contentType: entity.contentType,
            mediaUrl: entity.mediaUrl,
            assignmentId: entity.assignmentId,
            durationSec: entity.durationSec,
            position: entity.position,
            createdAt: entity.createdAt,
        }
    }

    static toDomain(raw) {
        if (!raw)
            return null;

        return LessonEntity.rehydrate(raw);
    }
}