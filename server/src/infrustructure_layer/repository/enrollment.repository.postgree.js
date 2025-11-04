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
}