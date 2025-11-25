import { Role } from "../../../src/domain_layer/role.entity";

export const instructor = {
    id: "create course",
    username: "create course",
    email: "create course",
    roles: {
        create: {
            roleId: 2
        }
    }
}

export const input = {
    authId: "create course",
    title: "create course",
    instructorId: instructor.id,
}