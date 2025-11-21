import { z } from "zod";

export class AuditLog {
    id;
    actorId;
    action;
    resource;
    resourceId;
    data;
    createdAt;

    constructor(input) {
        Object.assign(this, input);
        this.createdAt = new Date();
    }

    static create(input) {
        const parsedInput = createSchema.parse(input);
        return new AuditLog(input);
    }
}

const createSchema = z.object({
    actorId: z.string(),
    action: z.string(),
    resource: z.string(),
    resourceId: z.string(),
    data: z.json()
})