export class UserEntity {
    id;
    email;
    username;
    password;
    createdAt;
    roles = [];

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

    static create(email, password, name) {
        let user = new UserEntity();
        user.email = email;
        user.password = password;
        user.username = name;
        return user;
    }
}