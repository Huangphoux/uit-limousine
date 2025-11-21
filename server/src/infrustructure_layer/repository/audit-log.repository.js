import { AuditLogMapper } from "../mapper/audit-log.mapper.js";

export class AuditLogRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async add(log) {
        const raw = await this.prisma.AuditLog.create({
            data: AuditLogMapper.toPersistence(log),
        });
        return AuditLogMapper.toDomain(raw);
    }

    static baseQuery = {
        id: true,
        actorId: true,
        action: true,
        resource: true,
        resourceId: true,
        data: true,
        createdAt: true,
    }
}