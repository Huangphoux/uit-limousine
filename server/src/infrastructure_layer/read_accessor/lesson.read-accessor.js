export class LessonReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getIdsByModuleId(moduleId) {
        return await this.prisma.lesson.findMany({
            where: { moduleId },
            select: { id: true }
        });
    }
}