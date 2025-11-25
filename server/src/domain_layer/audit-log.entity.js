import { z } from "zod";

export const auditLogSchema = z.object({
    id: z.string().nullable().default(null),
    actorId: z.string().nullable().default(null),
    action: z.string(),
    resource: z.string().nullable().default(null),
    resourceId: z.string().nullable().default(null),
    data: z.json().nullable().default(null),
    createdAt: z.date().default(() => new Date()),
})

export class AuditLog {
    static schema = auditLogSchema;

    static create(input) {
        const parsedInput = AuditLog.schema.parse(input);

        // Business rules here

        return Object.assign(new AuditLog(), input);
    }

    static rehydrate(input) {
        if (!input) return null;
        return Object.assign(new AuditLog(), input);
    }
}