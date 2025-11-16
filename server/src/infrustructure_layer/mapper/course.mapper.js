import { CourseEntity } from '../../domain_layer/course.entity.js';

export class CourseMapper {
    static toDomain(prismaCourse) {
        if (!prismaCourse) return prismaCourse;

        let courseEntity = new CourseEntity();
        courseEntity.id = prismaCourse.id;
        courseEntity.title = prismaCourse.title;
        courseEntity.description = prismaCourse.description;
        courseEntity.coverImg = prismaCourse.coverImg;
        courseEntity.instructor = prismaCourse.instructor;
        courseEntity.reviews = prismaCourse.reviews;
        courseEntity.enrollments = prismaCourse.enrollments;
        courseEntity.price = prismaCourse.price;
        courseEntity.createdAt = prismaCourse.createdAt;
        return courseEntity;
    }
}