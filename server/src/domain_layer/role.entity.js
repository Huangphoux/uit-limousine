import z from "zod";

export const roleSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
})

export class RoleEntity {
    static schema = roleSchema;

    static rehydrate(input) {
        if (!input) return null;
        return Object.assign(new RoleEntity(), input);
    }
}

export const Role = {
    ADMIN: "ADMIN",
    INSTRUCTOR: "INSTRUCTOR",
    LEARNER: "LEARNER",
}