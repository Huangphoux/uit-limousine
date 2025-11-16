export class CourseReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getCourseMaterials(courseId) {
        return await this.prisma.module.findMany({
            where: { courseId },
            orderBy: { position: "asc" },
            select: {
                id: true,
                title: true,
                lessons: {
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        title: true,
                        contentType: true,
                        mediaUrl: true,
                        durationSec: true,
                        position: true,
                    },
                },
            },
        });
    }
}