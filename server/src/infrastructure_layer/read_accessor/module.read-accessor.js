export class ModuleReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getIdsByCourseId(courseId) {
        return await this.prisma.module.findMany({
            where: { courseId },
            select: { id: true }
        });
    }
}