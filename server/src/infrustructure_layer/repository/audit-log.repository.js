import { toPersistence } from "../../domain_layer/domain_service/factory.js";
import { AuditLog } from "../../domain_layer/audit-log.entity.js";
import { buildQuery } from "../../utils/query-builder.js";

export class AuditLogRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async add(log) {
        const raw = await this.prisma.AuditLog.create({
            data: toPersistence(log),
            select: AuditLogRepository.baseQuery
        });
        return AuditLog.rehydrate(raw);
    }

    static baseQuery = buildQuery(AuditLog.schema);
}