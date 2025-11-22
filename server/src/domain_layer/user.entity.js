export class UserEntity {
    id;
    email;
    name;
    password;
    createdAt;
    roles = [];

    addRole(role) {
        if (this.roles.some(r => r.id == role.id))
            return;

        this.roles.push(role);
    }

    static create(email, password, name) {
        let user = new UserEntity();
        user.email = email;
        user.password = password;
        user.name = name;
        return user;
    }
}