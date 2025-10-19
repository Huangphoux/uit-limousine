import { CourseMapper } from "../mapper/course.mapper.js";

export class CourseRepository {
    #courseModel;

    constructor(courseModel) {
        this.#courseModel = courseModel;
    }

    async findByFilter({ title, page, limit }) {
        const result = await this.#courseModel.findMany({
            where: {
                title: title,
            },
            include: { instructor: true },
        });
        const courses = result.map(prismaCourse => CourseMapper.toDomain(prismaCourse));
        return courses;
    }
}