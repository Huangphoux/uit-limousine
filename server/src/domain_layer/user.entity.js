export class UserEntity
{
    constructor(id, email, password)
    {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    matchPassword(password)
    {
        return this.password === password;
    }
}