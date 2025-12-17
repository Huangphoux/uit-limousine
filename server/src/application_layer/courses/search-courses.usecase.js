import { logger } from "../../utils/logger.js";

export class SearchCoursesUseCase {
  #courseRepository;

  constructor(courseRepository) {
    this.#courseRepository = courseRepository;
  }

  async execute({ search, category, level, page = 1, limit = 10 }) {
    logger.debug("Executing Search Courses operation");

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

    logger.debug("Finish Search Courses operation");
    return {
      courses: result.map((courseEntity) => ({
        id: courseEntity.id,
        title: courseEntity.title,
        description: courseEntity.description,
        instructor: courseEntity.instructor
          ? {
              id: courseEntity.instructor.id,
              fullName: courseEntity.instructor.name,
            }
          : null,
        thumbnail: courseEntity.coverImg,
        rating: 4.5,
        enrollmentCount: 120,
        price: courseEntity.price,
        createdAt: courseEntity.createdAt,
      })),
      total: 50,
      page: 1,
      totalPages: 5,
    };
  }
}
