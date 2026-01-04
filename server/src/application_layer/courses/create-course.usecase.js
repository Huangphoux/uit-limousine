import z from "zod";
import { CourseEntity } from "../../domain_layer/course/course.entity.js";
import { logger } from "../../utils/logger.js";
import { Role } from "../../domain_layer/role.entity.js";

export const inputSchema = CourseEntity.schema.merge(
  z.object({
    authId: z.string(),
  })
);

export const outputSchema = CourseEntity.schema.merge(
  z.object({
    instructor: z.object({
      id: z.string(),
      fullname: z.string(),
      role: z.string(),
    }),
  })
);

export class CreateCourseUsecase {
  constructor(userRepository, courseRepository) {
    this.userRepository = userRepository;
    this.courseRepository = courseRepository;
  }

  async execute(input) {
    const parsedInput = inputSchema.parse(input);
    const log = logger.child({
      task: "Creating course",
      adminId: parsedInput.authId,
      instructorId: parsedInput.instructorId,
    });
    log.info("Task started");

    const instructor = await this.userRepository.findById(parsedInput.instructorId);
    if (!instructor) {
      log.warn("Task failed: invalid instructor id");
      throw Error(`User not found, ${parsedInput.id}`);
    }
    if (!instructor.hasRole(Role.INSTRUCTOR)) {
      log.warn("Task failed: invalid instructor role");
      throw Error(`Unauthorized user, ${instructor.id}`);
    }

    // Map duration inputs from strings (if present) to numbers
    if (parsedInput.durationWeeks) parsedInput.durationWeeks = Number(parsedInput.durationWeeks);
    if (parsedInput.durationDays) parsedInput.durationDays = Number(parsedInput.durationDays);
    if (parsedInput.durationHours) parsedInput.durationHours = Number(parsedInput.durationHours);

    const course = CourseEntity.create(parsedInput);

    const savedCourse = await this.courseRepository.add(course);

    const output = {
      ...savedCourse.toJSON(), // Ensure all course fields are included
      instructor: {
        id: instructor.id,
        fullname: instructor.username || instructor.name || instructor.email.split("@")[0],
        role: Role.INSTRUCTOR,
      },
    };

    const validatedOutput = outputSchema.parse(output);
    log.info("Task completed");

    return validatedOutput;
  }
}
