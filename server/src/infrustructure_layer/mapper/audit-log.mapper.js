import { AuditLog } from "../../domain_layer/audit-log.entity.js";

export class AuditLogMapper {
    static toDomain(raw) {
        if (!raw) return raw;
        return new AuditLog(raw);
    }

    static toPersistence(en) {
        const { id, ...persitable } = en;
        return persitable;
    }
}