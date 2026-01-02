import { logger } from "../../utils/logger.js";

export class SearchCoursesUseCase {
  #courseRepository;

  constructor(courseRepository) {
    this.#courseRepository = courseRepository;
  }

  async execute({
    search,
    category,
    level,
    page = 1,
    limit = 10,
    instructorId,
    currentUserId,
  } = {}) {
    logger.debug("Executing Search Courses operation");
    // Parse pagination
    let take = parseInt(limit);
    if (isNaN(take) || take < 1) take = 10;

    let currentPage = parseInt(page);
    if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

    let skip = (currentPage - 1) * take;

    // Build filter
    const filter = { skip, take, currentUserId };
    if (search?.trim()) filter.title = search.trim();
    if (category?.trim()) filter.category = category.trim();
    if (level?.trim()) filter.level = level.trim();
    if (instructorId) filter.instructorId = instructorId;

    // Fetch data + count total
    const result = await this.#courseRepository.findByFilter(filter);

    const countFilter = { ...filter };
    delete countFilter.skip;
    delete countFilter.take;
    const total = await this.#courseRepository.countByFilter(countFilter);

    const totalPages = Math.ceil(total / take);

    return {
      courses: result.map((courseEntity) => ({
        id: courseEntity.id,
        title: courseEntity.title,
        description: courseEntity.description,
        category: courseEntity.category || "General",
        level: courseEntity.level || "BEGINNER",
        instructor: courseEntity.instructor
          ? {
              id: courseEntity.instructor.id,
              fullName: courseEntity.instructor.name,
            }
          : null,
        // Ensure coverImage uses the entity's `coverImage` field (not coverImg)
        coverImage: courseEntity.coverImage || null,
        image: courseEntity.coverImage || null,
        thumbnail: courseEntity.coverImage || null,
        rating: courseEntity.rating || 0,
        enrollmentCount: courseEntity.enrollmentCount || 0,
        enrolledStudents: courseEntity.enrollmentCount || 0,
        price: courseEntity.price || 0,
        createdAt: courseEntity.createdAt,
        enrolled: courseEntity.isEnrolledByCurrentUser || false,
        published: courseEntity.published || false,
        status: courseEntity.published ? "Published" : "Draft",
        // Include duration fields
        durationWeeks: courseEntity.durationWeeks || null,
        durationDays: courseEntity.durationDays || null,
        durationHours: courseEntity.durationHours || courseEntity.calculatedDurationHours || null,
      })),
      total: total,
      page: currentPage,
      totalPages: totalPages,
    };
  }
}
