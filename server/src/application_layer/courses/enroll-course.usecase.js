import { EnrollmentEntity, enrollmentSchema } from "../../domain_layer/enrollment.entity.js";
import z from "zod";
import { logger } from "../../utils/logger.js";

const inputSchema = z.object({
  authId: z.string(),
  courseId: z.string(),
});

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

    // 1. Kiểm tra khóa học tồn tại và đã xuất bản chưa
    const course = await this.courseRepository.findById(parsedInput.courseId);
    if (!course) {
      log.warn("Task failed: invalid course id");
      throw Error(`Course not found, ${parsedInput.courseId}`);
    }
    if (!course.published) {
      log.warn("Task failed: unpublished course");
      throw Error(`Course hasn't been published`);
    }

    // 2. Kiểm tra thanh toán nếu khóa học có phí
    let isPaymentSuccessful = false;
    if (course.price > 0) {
      isPaymentSuccessful = await this.paymentReadAccessor.isPaymentSuccessful(
        parsedInput.authId,
        parsedInput.courseId
      );
      if (!isPaymentSuccessful) {
        log.warn("Task failed: unpaid course");
        throw Error(`Payment hasn't been successful`);
      }
    }

    // 3. XỬ LÝ ĐĂNG KÝ (FIX Ở ĐÂY)
    const enrolled = await this.enrollmentRepository.findByUserAndCourseId(
      parsedInput.authId,
      parsedInput.courseId
    );

    if (enrolled) {
      // Nếu trạng thái đang là CANCELLED, thì kích hoạt lại (Re-enroll)
      if (enrolled.status === "CANCELLED") {
        log.info("Re-enrolling previously cancelled course");
        const updatedEnrollment = await this.enrollmentRepository.updateStatus(
          enrolled.id,
          "ENROLLED"
        );

        // If a successful payment exists, mark the enrollment as paid
        if (isPaymentSuccessful && !updatedEnrollment.isPaid) {
          await this.enrollmentRepository.updatePaid(updatedEnrollment.id, true);
          updatedEnrollment.isPaid = true;
        }

        return outputSchema.parse(updatedEnrollment);
      }

      // Nếu đang là ENROLLED hoặc trạng thái khác, trả về luôn
      log.info("Task completed: already enrolled");

      // If the user already has an enrollment but we have a successful payment, ensure isPaid is set
      if (isPaymentSuccessful && !enrolled.isPaid) {
        await this.enrollmentRepository.updatePaid(enrolled.id, true);
        enrolled.isPaid = true;
      }

      return outputSchema.parse(enrolled);
    }

    // 4. Nếu chưa từng có bản ghi nào thì mới tạo mới hoàn toàn
    let enrollment = EnrollmentEntity.create({
      userId: parsedInput.authId,
      courseId: parsedInput.courseId,
      isPaid: Boolean(isPaymentSuccessful),
    });

    let savedEnrollment = await this.enrollmentRepository.add(enrollment);

    log.info("Task completed: new enrollment");
    return outputSchema.parse(savedEnrollment);
  }
}
