import { rehydrate, toPersistence } from "../../domain_layer/domain_service/factory.js";
import { EnrollmentEntity, enrollmentSchema } from "../../domain_layer/enrollment.entity.js";
import { buildQuery } from "../../utils/query-builder.js";

export class EnrollmentRepositoryPostgree {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async findByUserAndCourseId(userId, courseId) {
        const raw = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId, courseId
                }
            },
            select: EnrollmentRepositoryPostgree.baseQuery,
        });

        return rehydrate(EnrollmentEntity, raw);
    }

    async add(entity) {
        const raw = await this.prisma.enrollment.create({ data: toPersistence(entity) });
        return rehydrate(EnrollmentEntity, raw);
    }

    static baseQuery = buildQuery(enrollmentSchema);
}