import { CourseMapper } from "../mapper/course.mapper.js";

export class CourseRepository {
    #courseModel;

    constructor(courseModel) {
        this.#courseModel = courseModel;
    }

    async findById(id) {
        const row = await this.#courseModel.findUnique({
            where: { id: id },
            select: CourseRepository.baseQuery,
        });

        return CourseMapper.toDomain(row);
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

    async save(course) {
        const raw = await this.#courseModel.update({
            where: { id: course.id },
            data: CourseMapper.toPersistence(course),
        })

        return CourseMapper.toDomain(raw);
    }

    static baseQuery = {
        id: true,
        title: true,
        shortDesc: true,
        description: true,
        language: true,
        level: true,
        price: true,
        published: true,
        publishDate: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        instructorId: true,
    }
}