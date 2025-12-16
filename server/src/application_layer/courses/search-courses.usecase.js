import { logger } from "../../utils/logger.js";

export class SearchCoursesUseCase {
    #courseRepository;

    constructor(courseRepository) {
        this.#courseRepository = courseRepository;
    }

    async execute({ search, category, level, page = 1, limit = 10 }) {
        const log = logger.child({
            task: "Searching course"
        });
        log.info("Task started");

        let take = parseInt(limit);
        if (take < 0) take = 10;
        let skip = (parseInt(page) - 1) * limit;
        if (skip < 0) skip = 0;
        const result = await this.#courseRepository.findByFilter({
            title: search,
            category: category,
            level: level,
            skip: skip,
            take: take,
        });

        log.info("Task completed");
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