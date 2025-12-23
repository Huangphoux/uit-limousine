import { EnrollmentEntity, enrollmentSchema } from "../../domain_layer/enrollment.entity.js";
import z from "zod";
import { logger } from "../../utils/logger.js";

const inputSchema = z.object({
    authId: z.string(),
    courseId: z.string(),
})

export const outputSchema = enrollmentSchema.transform((e) => ({
    enrollmentId: e.id,
    courseId: e.courseId,
    studentId: e.userId,
    enrolledAt: e.enrolledAt,
    status: e.status,
}));

export class EnrollCourseUseCase {
    constructor(courseRepository, paymentReadAccessor, enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.paymentReadAccessor = paymentReadAccessor;
        this.enrollmentRepository = enrollmentRepository;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({
            task: "Enrolling course",
            userId: parsedInput.authId,
            courseId: parsedInput.courseId,
        });
        log.info("Task started");

        const course = await this.courseRepository.findById(parsedInput.courseId);
        if (!course) {
            log.warn("Task failed: invalid course id");
            throw Error(`Course not found, ${parsedInput.courseId}`);
        }
        if (!course.published) {
            log.warn("Task failed: unpublished course");
            throw Error(`Course hasn't been published`);
        }
        if (course.price > 0) {
            const isPaymentSuccessful = await this.paymentReadAccessor.isPaymentSuccessful(parsedInput.authId, parsedInput.courseId);
            if (!isPaymentSuccessful) {
                log.warn("Task failed: unpaid course");
                throw Error(`Payment hasn't been successful`);
            }
        }
        const enrolled = await this.enrollmentRepository.findByUserAndCourseId(parsedInput.authId, parsedInput.courseId);
        if (enrolled) {
            log.info("Task completed: enrolled course");
            return outputSchema.parse(enrolled);
        }

        let enrollment = EnrollmentEntity.create({
            userId: parsedInput.authId,
            courseId: parsedInput.courseId
        });

        let savedEnrollment = await this.enrollmentRepository.add(enrollment);;

        log.info("Task completed: new enrollment");
        return outputSchema.parse(savedEnrollment);
    }
}