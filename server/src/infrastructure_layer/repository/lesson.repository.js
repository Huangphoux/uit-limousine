import { LessonMapper } from "../mapper/lesson.mapper.js";

export class LessonRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getById(id) {
        const raw = await this.prisma.lesson.findUnique({
            where: { id },
            select: LessonRepository.baseQuery,
        })

        return LessonMapper.toDomain(raw);
    }

    async save(lesson) {
        let raw = null;
        if (!lesson)
            return raw;

        const persistence = LessonMapper.toPersistence(lesson)
        if (!lesson.id) {
            raw = this.prisma.lesson.create({
                data: persistence
            });
        }
        else {
            raw = this.prisma.lesson.update({
                where: { id: lesson.id },
                data: persistence
            });
        }

        return LessonMapper.toDomain(await raw);
    }

    async deleteByIds(ids) {
        await this.prisma.lesson.deleteMany({
            where: { id: { in: ids } }
        });
    }

    static baseQuery = {
        id: true,
        moduleId: true,
        title: true,
        content: true,
        contentType: true,
        mediaUrl: true,
        assignmentId: true,
        durationSec: true,
        position: true,
        createdAt: true,
    }
}