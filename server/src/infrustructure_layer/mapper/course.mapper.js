import { CourseEntity } from '../../domain_layer/course/course.entity.js';

export class CourseMapper {
    static toDomain(raw) {
        if (!raw) return raw;
        return new CourseEntity(raw);
    }

    static toPersistence(entity) {
        const { id, ...persitable } = en;
        return persitable;
    }
}