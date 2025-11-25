import z from "zod"
import { CourseEntity } from "../../domain_layer/course/course.entity.js";
import { logger } from "../../utils/logger.js";
import { Role } from "../../domain_layer/role.entity.js";

export const inputSchema = CourseEntity.schema.merge(z.object({
    authId: z.string(),
}));

export const outputSchema = CourseEntity.schema.merge(z.object({
    instructor: z.object({
        id: z.string(),
        fullname: z.string(),
        role: z.string(),
    }),
}));

export class CreateCourseUsecase {
    constructor(userRepository, courseRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        logger.debug('Executing create course operation', {
            title: parsedInput.title,
            instructorId: parsedInput.instructorId,
            correlationId: parsedInput.authId,
        });

        const instructor = await this.userRepository.findById(parsedInput.instructorId);
        if (!instructor) throw Error(`User not found, ${parsedInput.id}`);
        logger.debug('Fetched instructor', {
            instructorFound: !!instructor,
            instructorId: parsedInput.instructorId,
        });
        if (!instructor.hasRole(Role.INSTRUCTOR))
            throw Error(`Unauthorized user, ${instructor.id}`);

        const course = CourseEntity.create(parsedInput);
        logger.debug('Mapped input to CourseEntity', {
            courseId: course.id,
        });

        const savedCourse = await this.courseRepository.add(course);
        logger.debug('Course saved successfully', {
            savedCourseId: savedCourse.id,
        });

        output = outputSchema.parse({
            ...savedCourse,
            instructor: {
                id: instructor.id,
                fullname: instructor.username,
                role: Role.INSTRUCTOR
            }
        });

        return output;
    }
}