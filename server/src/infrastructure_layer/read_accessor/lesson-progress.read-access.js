export class LessonProgressReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async countComplete(lessonIds) {
        const count = await this.prisma.lessonProgress.count({
            where: {
                lessonId: {
                    in: lessonIds,
                }
            }
        });
        return count;
    }
}