import z from "zod";

export const inputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  level: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  durationWeeks: z.number().nullable().optional(),
  durationDays: z.number().nullable().optional(),
  durationHours: z.number().nullable().optional(),
  organization: z.string().nullable().optional(),
  requirement: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

export class UpdateCourseUsecase {
  constructor(courseRepo) {
    this.courseRepo = courseRepo;
  }

  async execute(input) {
    const parsedInput = inputSchema.parse(input);
    console.log("[UpdateCourseUsecase] parsedInput:", parsedInput);

    let course = await this.courseRepo.getById(parsedInput.id);
    if (!course) throw Error("Invalid course id");

    if (course.title !== parsedInput.title) course.rename(parsedInput.title);
    if (course.description !== parsedInput.description)
      course.reviseDescription(parsedInput.description);
    if (course.price !== parsedInput.price) course.setPrice(parsedInput.price);
    if (course.level !== parsedInput.level) course.changeLevel(parsedInput.level);
    if (course.language !== parsedInput.language) course.changeLanguage(parsedInput.language);
    if (course.coverImage !== parsedInput.coverImage)
      course.replaceCoverImage(parsedInput.coverImage);

    // New metadata fields
    if (parsedInput.category !== undefined && course.category !== parsedInput.category)
      course.setCategory(parsedInput.category);
    if (
      (parsedInput.durationWeeks !== undefined ||
        parsedInput.durationDays !== undefined ||
        parsedInput.durationHours !== undefined) &&
      (course.durationWeeks !== parsedInput.durationWeeks ||
        course.durationDays !== parsedInput.durationDays ||
        course.durationHours !== parsedInput.durationHours)
    )
      course.setDuration(
        parsedInput.durationWeeks,
        parsedInput.durationDays,
        parsedInput.durationHours
      );
    if (parsedInput.organization !== undefined && course.organization !== parsedInput.organization)
      course.setOrganization(parsedInput.organization);
    if (parsedInput.requirement !== undefined && course.requirement !== parsedInput.requirement)
      course.setRequirement(parsedInput.requirement);

    // Handle publish/unpublish
    if (parsedInput.published !== undefined) {
      course.published = parsedInput.published;
      if (parsedInput.published && !course.publishDate) {
        course.publishDate = new Date();
      } else if (!parsedInput.published) {
        course.publishDate = null;
      }
    }

    const savedCourse = await this.courseRepo.atomicSave(course);
    return savedCourse;
  }
}
