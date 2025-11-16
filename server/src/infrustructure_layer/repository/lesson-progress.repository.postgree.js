import { LessonProgressMapper } from "../mapper/lesson-progress.mapper.js";

export class LessonProgressRepositoryPostgree {
    #model;

    constructor(model) {
        this.#model = model;
    }

    async findByPairId(userId, lessonId) {
        const row = await this.#model.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
        });

        return LessonProgressMapper.toDomain(row);
    }

    async save(entity) {
        const row = await this.#model.update({
            where: { id: entity.id },
            data: LessonProgressMapper.toPersistence(entity)
        });
        return LessonProgressMapper.toDomain(row);
    }
}