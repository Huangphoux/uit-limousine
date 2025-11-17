import { EnrollmentMapper } from "../mapper/enrollment.mapper.js";

export class EnrollmentRepositoryPostgree {
    #model;

    constructor(model) {
        this.#model = model;
    }

    async add(entity) {
        const row = await this.#model.create({ data: EnrollmentMapper.toPersistence(entity) });
        return EnrollmentMapper.toDomain(row);
    }

    async findByUserAndCourse(userId, courseId) {
        const row = await this.#model.findUnique({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId
                }
            }
        });
        return row ? EnrollmentMapper.toDomain(row) : null;
    }
}