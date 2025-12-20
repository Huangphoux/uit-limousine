// ApproveCourseUseCase.js
import z from "zod";

const inputSchema = z.object({
    authId: z.string(),
    id: z.string(),
    action: z.enum(["APPROVE", "REJECT"]),
    reason: z.string().optional(), // Lý do nếu Reject
});

export class ApproveCourseUseCase {
    constructor(courseRepository, userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    async execute(input) {
        const parsed = inputSchema.parse(input);

        // 1. Kiểm tra khóa học tồn tại
        const course = await this.courseRepository.findById(parsed.id);
        if (!course) throw new Error("Course not found");

        // 2. Thực hiện hành động
        if (parsed.action === "APPROVE") {
            await this.courseRepository.updateApprovalStatus(parsed.id, {
                published: true,
                publishDate: new Date(),
            });
            return { message: "Course approved and published successfully" };
        } else {
            // REJECT logic
            await this.courseRepository.updateApprovalStatus(parsed.id, {
                published: false,
                publishDate: null,
            });
            // Lưu lý do reject vào log hoặc bảng thông báo nếu cần
            return { message: "Course rejected" };
        }
    }
}