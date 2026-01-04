import z from "zod";
import { logger } from "../../utils/logger.js";

const inputSchema = z.object({
    authId: z.string(),
    courseId: z.string(),
});

export class UnenrollCourseUseCase {
    constructor(enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({
            task: "Unenrolling course (Soft Delete)",
            userId: parsedInput.authId,
            courseId: parsedInput.courseId,
        });
        log.info("Task started");

        // 1. Kiểm tra xem bản ghi đăng ký hiện đang ACTIVE không
        const enrollment = await this.enrollmentRepository.findByUserAndCourseId(
            parsedInput.authId, 
            parsedInput.courseId
        );

        // Chỉ cho phép hủy nếu đang ở trạng thái ENROLLED (hoặc tương đương)
        if (!enrollment || enrollment.status !== 'ENROLLED') {
            log.warn("Task failed: No active enrollment found");
            throw new Error("You are not currently enrolled in this course");
        }

        // 2. Cập nhật trạng thái thành UNENROLLED
        // Giả sử Entity của bạn có hàm updateStatus hoặc bạn truyền trực tiếp vào repo
        await this.enrollmentRepository.updateStatus(enrollment.id, 'CANCELLED');

        log.info("Task completed: enrollment status updated to CANCELLED");
        
        return {
            success: true,
            message: "Unsubscribed successfully",
            status: 'CANCELLED'
        };
    }
}