import { SubmissionEntity } from '../../domain_layer/submission.entity.js';

export class SubmissionMapper {
    static toDomain(prismaSubmission) {
        const sub = new SubmissionEntity();
        sub.id = prismaSubmission.id;
        sub.assignmentId = prismaSubmission.assignmentId;
        sub.courseId = prismaSubmission.courseId;
        sub.studentId = prismaSubmission.studentId;
        sub.text = prismaSubmission.text;
        // assume prisma stores files as JSON array column `files`
        sub.files = prismaSubmission.files;
        sub.version = prismaSubmission.version;
        sub.submittedAt = prismaSubmission.submittedAt;
        sub.status = prismaSubmission.status;
        sub.grade = prismaSubmission.grade;
        sub.feedback = prismaSubmission.feedback;
        return sub;
    }
}
