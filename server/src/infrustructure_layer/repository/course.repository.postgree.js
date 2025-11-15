import { CourseMapper } from "../mapper/course.mapper.js";

export class CourseRepository {
    #courseModel;

    constructor(courseModel) {
        this.#courseModel = courseModel;
    }

    async findByFilter({ title, category, level, skip, take }) {
        const result = await this.#courseModel.findMany({
            where: {
                title: title,
                category: category,
                level: level,
            },
            skip,
            take,
            include: { instructor: true },
        });
        const courses = result.map(prismaCourse => CourseMapper.toDomain(prismaCourse));
        return courses;
    }
}