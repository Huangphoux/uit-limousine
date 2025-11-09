export class UserReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getLessonProgresses(userId) {
        return await this.prisma.lessonProgress.findMany({
            where: { userId },
            select: {
                lessonId: true,
                progress: true,
            },
        });
    }
}