import { AssignmentEntity } from "../../domain_layer/course/assignment.entity.js";

export class AssignmentMapper {
    static toPersistence(entity) {
        return {
            courseId: entity.courseId,
            title: entity.title,
            description: entity.description,
            dueDate: entity.dueDate,
            maxPoints: entity.maxPoints,
            createdAt: entity.createdAt,
        }
    }

    static toDomain(raw) {
        if (!raw)
            return null;

        return AssignmentEntity.rehydrate(raw);
    }
}