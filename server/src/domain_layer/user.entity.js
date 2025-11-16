export class UserEntity {
    #id = null;
    #email = null;
    #name = null;
    #password = null;
    #createdAt = null;
    #roles = [];

    get id() { return this.#id; }
    get email() { return this.#email; }
    get name() { return this.#name; }
    get password() { return this.#password; }
    get createdAt() { return this.#createdAt; }
    get roles() { return this.#roles; }

    set id(value) { this.#id = value; }
    set email(value) { this.#email = value; }
    set name(value) { this.#name = value; }
    set password(value) { this.#password = value; }
    set createdAt(value) { this.#createdAt = value; }
    set roles(value) { this.#roles = value; }

    addRole(role) {
        this.#roles.push(role);
    }

    static create(email, password, name) {
        let user = new UserEntity();
        user.email = email;
        user.password = password;
        user.name = name;
        return user;
    }
}