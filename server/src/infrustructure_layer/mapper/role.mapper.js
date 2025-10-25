import { RoleEntity } from "../../domain_layer/role.entity.js";

export class RoleMapper {
    static toDomain(prismaRole) {
        var roleEntity = new RoleEntity();
        roleEntity.id = prismaRole.id;
        roleEntity.name = prismaRole.name;
        return roleEntity;
    }
}