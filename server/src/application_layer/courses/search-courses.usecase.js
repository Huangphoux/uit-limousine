import e from "express";

export class SearchCoursesUseCase {
    #courseRepository;

    constructor(courseRepository) {
        this.#courseRepository = courseRepository;
    }

    async execute({ search }) {
        const result = await this.#courseRepository.findByFilter({ title: search });
        return {
            courses: result.map(courseEntity => ({
                id: courseEntity.id,
                title: courseEntity.title,
                description: courseEntity.description,
                instructor: {
                    id: courseEntity.instructor.id,
                    fullName: courseEntity.instructor.name,
                },
                thumbnail: courseEntity.coverImg,
                rating: 4.5,
                enrollmentCount: 120,
                price: courseEntity.price,
                createdAt: courseEntity.createdAt,
            })),
            total: 50,
            page: 1,
            totalPages: 5
        }
    }
}