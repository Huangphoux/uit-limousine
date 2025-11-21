import { UserEntity } from "../../domain_layer/user.entity.js";
import { RoleMapper } from "./role.mapper.js";

export class UserMapper {
    static toPersistence(userEntity) {
        return {
            email: userEntity.email,
            password: userEntity.password,
            name: userEntity.name,
            roles: {
                create: userEntity.roles.map(role => ({ roleId: role.id })),
            }
        };
    }

    static toDomain(prismaUser) {
        if (!prismaUser) return prismaUser;
        let userEntity = new UserEntity();
        userEntity.id = prismaUser.id;
        userEntity.email = prismaUser.email;
        userEntity.password = prismaUser.password;
        userEntity.name = prismaUser.name;
        userEntity.createdAt = prismaUser.createdAt;
        userEntity.roles = prismaUser.roles.map(prismaUserRole => RoleMapper.toDomain(prismaUserRole.role));
        return userEntity;
    }
}