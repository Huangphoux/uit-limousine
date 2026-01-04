import { ModuleEntity } from "../../domain_layer/course/module.entity.js";

export class ModuleMapper {
    static toPersistence(entity) {
        return {
            courseId: entity.courseId,
            title: entity.title,
            position: entity.position,
            createdAt: entity.createdAt,
        };
    }

    static toDomain(raw) {
        if (!raw)
            return null;
        return ModuleEntity.rehydrate(raw);
    }
}