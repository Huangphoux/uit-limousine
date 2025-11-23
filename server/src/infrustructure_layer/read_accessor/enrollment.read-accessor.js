export class EnrollmentReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async isEnrolled(userId, courseId) {
        const count = await this.prisma.enrollment.count({
            where: {
                userId, courseId
            }
        })

        return count > 0
    }
}