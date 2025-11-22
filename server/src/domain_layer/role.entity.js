export class RoleEntity {
    #id;
    #name;

    get id() { return this.#id; }
    get name() { return this.#name; }

    set id(value) { this.#id = value; }
    set name(value) { this.#name = value; }
}

export const Role = {
    ADMIN: "ADMIN",
    INSTRUCTOR: "INSTRUCTOR",
    LEARNER: "LEARNER",
}