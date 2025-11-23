import { EnrollmentEntity, enrollmentSchema } from "../../domain_layer/enrollment.entity.js";
import z from "zod";

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

        const course = await this.courseRepository.findById(parsedInput.courseId);
        if (!course) throw Error(`Course not found, ${parsedInput.courseId}`);
        if (!course.published) throw Error(`Course hasn't been published`);
        if (course.price > 0) {
            const isPaymentSuccessful = await this.paymentReadAccessor.isPaymentSuccessful(parsedInput.authId, parsedInput.courseId);
            if (!isPaymentSuccessful) throw Error(`Payment hasn't been successful`);
        }
        const enrolled = await this.enrollmentRepository.findByUserAndCourseId(parsedInput.authId, parsedInput.courseId);
        if (enrolled) return outputSchema.parse(enrolled);

        let enrollment = EnrollmentEntity.create({
            userId: parsedInput.authId,
            courseId: parsedInput.courseId
        });

        let savedEnrollment = await this.enrollmentRepository.add(enrollment);;

        return outputSchema.parse(savedEnrollment);
    }
}