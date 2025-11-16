import { EnrollmentEntity } from "../../domain_layer/enrollment.entity.js";

export class EnrollmentMapper {
    static toPersistence(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            courseId: entity.courseId,
            enrolledAt: entity.enrolledAt,
            status: entity.status,
        };
    }

    static toDomain(raw) {
        if (!raw) return raw;

        let entity = new EnrollmentEntity();
        entity.id = raw.id;
        entity.userId = raw.userId;
        entity.courseId = raw.courseId;
        entity.enrolledAt = raw.enrolledAt;
        entity.status = raw.status;
        return entity;
    }
}