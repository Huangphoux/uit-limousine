import { LessonResourceMapper } from "../mapper/lesson-resource.mapper.js";

export class LessonResourceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getById(id) {
        const raw = await this.prisma.lessonResource.findUnique({
            where: { id },
        });

        return LessonResourceMapper.toDomain(raw);
    }

    async getByLessonId(lessonId) {
        const raws = await this.prisma.lessonResource.findMany({
            where: { lessonId }
        });

        return raws.map(LessonResourceMapper.toDomain);
    }

    async save(entity) {
        let raw = null;
        if (!entity)
            return raw;

        const persistence = LessonResourceMapper.toPersistence(entity)
        if (!entity.id) {
            raw = this.prisma.lessonResource.create({
                data: persistence
            });
        }
        else {
            raw = this.prisma.lessonResource.update({
                where: { id: entity.id },
                data: persistence
            });
        }

        return LessonResourceMapper.toDomain(await raw);
    }

    async deleteByIds(ids) {
        await this.prisma.lessonResource.deleteMany({
            where: { id: { in: ids } }
        });
    }
}