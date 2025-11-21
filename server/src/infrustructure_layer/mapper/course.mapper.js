import { CourseEntity } from '../../domain_layer/course.entity.js';

export class CourseMapper {
    static toDomain(raw) {
        if (!raw) return raw;

        let courseEntity = new CourseEntity();
        courseEntity.id = raw.id;
        courseEntity.title = raw.title;
        courseEntity.description = raw.description;
        courseEntity.coverImg = raw.coverImg;
        courseEntity.instructor = raw.instructor;
        courseEntity.reviews = raw.reviews;
        courseEntity.enrollments = raw.enrollments;
        courseEntity.price = raw.price;
        courseEntity.createdAt = raw.createdAt;
        courseEntity.updatedAt = raw.updatedAt;
        courseEntity.instructorId = raw.instructorId;
        return courseEntity;
    }

    static toPersistence(entity) {
        return {
            title: entity.title,
            description: entity.description,
            coverImg: entity.coverImg,
            instructor: entity.instructor,
            reviews: entity.reviews,
            enrollments: entity.enrollments,
            price: entity.price,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            instructorId: entity.instructorId,
        }
    }
}