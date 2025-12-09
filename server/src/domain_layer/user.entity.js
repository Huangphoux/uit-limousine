import { z } from "zod";
import { RoleEntity, roleSchema } from "./role.entity.js";

export const userRoleSchema = z.object({
  id: z.int().default(null),
  userId: z.string(),
  roleId: z.string(),
  role: roleSchema.default(null),
});

export const userSchema = z.object({
  id: z.string().default(null),
  username: z.string().default(null),
  createdAt: z.date().default(() => new Date()),
  email: z.string(),
  updatedAt: z.date().default(() => new Date()),
  avatarUrl: z.string().default(null),
  bio: z.string().default(null),
  name: z.string().default(null),
  password: z.string().default(null),

  roles: z.array(userRoleSchema).default([]),
});

export class UserEntity {
  static schema = userSchema;

  addRole(role) {
    if (this.roles.some((r) => r.id == role.id)) return;

    this.roles.push(role);
  }

  hasRole(roleName) {
    if (this.roles.some((r) => r.name == roleName)) return true;
    return false;
  }

  static create(input, defaultRole) {
    let parsedInput = UserEntity.schema.parse(input);

    // Business rules here
    let entity = Object.assign(new UserEntity(), parsedInput);
    entity.addRole(defaultRole);

    return entity;
  }

  static rehydrate(input) {
    if (!input) return null;
    if (input.roles) input.roles = input.roles.map((r) => RoleEntity.rehydrate(r.role));

    return Object.assign(new UserEntity(), input);
  }
}
