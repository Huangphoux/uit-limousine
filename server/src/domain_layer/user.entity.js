import { z } from "zod";
import { RoleEntity, roleSchema } from "./role.entity.js";

export const userRoleSchema = z.object({
    role: roleSchema
})

export const userSchema = z.object({
    id: z.string().optional(),
    username: z.string().nullish(),
    createdAt: z.date().default(() => new Date()),
    email: z.string(),
    updatedAt: z.date().default(() => new Date()),
    avatarUrl: z.string().nullish(),
    bio: z.string().nullish(),
    name: z.string().nullish(),
    password: z.string().nullish(),

    roles: z.array(userRoleSchema).optional(),
});

export class UserEntity {
    static schema = userSchema;

    addRole(role) {
        if (this.roles.some(r => r.id == role.id))
            return;

        this.roles.push(role);
    }

    hasRole(roleName) {
        if (this.roles.some(r => r.name == roleName))
            return true;
        return false;
    }

    static create(input) {
        let parsedInput = UserEntity.schema.parse(input);

        // Business rules here

        return Object.assign(new UserEntity(), parsedInput);
    }

    static rehydrate(input) {
        if (!input) return null;
        if (input.roles)
            input.roles = input.roles.map(r => RoleEntity.rehydrate(r.role));

        return Object.assign(new UserEntity(), input);
    }
}