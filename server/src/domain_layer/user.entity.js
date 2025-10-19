export class UserEntity {
    #id;
    #email;
    #name = null;
    #password = null;
    #roles = null;

    constructor(id, email) {
        this.#id = id;
        this.#email = email;
    }

    get id() { return this.#id; }
    get email() { return this.#email; }
    get name() { return this.#name; }
    get password() { return this.#password; }
    get roles() { return this.#roles; }

    set name(value) { this.#name = value; }
    set password(value) { this.#password = value; }
    set roles(value) { this.#roles = value; }

    matchPassword(password) {
        return this.#password === password;
    }
}