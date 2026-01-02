import { LessonResourceEntity } from "../../domain_layer/course/lesson-resource.entity.js";

export class LessonResourceMapper {
    static toPersistence(entity) {
        return {
            lessonId: entity.lessonId,
            fileId: entity.fileId,
            filename: entity.filename,
            mimeType: entity.mimeType,
            createdAt: entity.createdAt,
        };
    }

    static toDomain(raw) {
        if (!raw)
            return null;

        return LessonResourceEntity.rehydrate(raw);
    }
}