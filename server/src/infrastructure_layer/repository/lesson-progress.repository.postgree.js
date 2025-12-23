import { toPersistence } from "../../domain_layer/domain_service/factory.js";
import { LessonProgressEntity } from "../../domain_layer/lesson-progress.entity.js";

export class LessonProgressRepositoryPostgree {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async findByUserAndLessonId(userId, lessonId) {
        const raw = await this.prisma.lessonProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
        });

        return LessonProgressEntity.rehydrate(raw);
    }

    async add(entity) {
        const raw = await this.prisma.lessonProgress.create({
            data: toPersistence(entity),
        })

        return LessonProgressEntity.rehydrate(raw);
    }

    async save(entity) {
        const raw = await this.prisma.lessonProgress.update({
            where: { id: entity.id },
            data: toPersistence(entity)
        });
        return LessonProgressEntity.rehydrate(raw);
    }
}