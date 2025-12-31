import z from "zod";

export const inputSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    price: z.number(),
    level: z.string().nullable().optional(),
    language: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
});

export class UpdateCourseUsecase {
    constructor(courseRepo) {
        this.courseRepo = courseRepo;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        let course = await this.courseRepo.getById(parsedInput.id);
        if (!course)
            throw Error("Invalid course id");

        if (course.title !== parsedInput.title) course.rename(parsedInput.title);
        if (course.description !== parsedInput.description) course.reviseDescription(parsedInput.description);
        if (course.price !== parsedInput.price) course.setPrice(parsedInput.price);
        if (course.level !== parsedInput.level) course.changeLevel(parsedInput.level);
        if (course.language !== parsedInput.language) course.changeLanguage(parsedInput.language);
        if (course.coverImage !== parsedInput.coverImage) course.replaceCoverImage(parsedInput.coverImage);

        const savedCourse = await this.courseRepo.atomicSave(course);
        return savedCourse;
    }
}