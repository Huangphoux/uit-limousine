export class LessonResourceReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getIdsByLessonId(lessonId) {
        return await this.prisma.lessonResource.findMany({
            where: { lessonId },
            select: { id: true }
        });
    }
}