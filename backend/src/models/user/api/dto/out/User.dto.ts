

export class UserDto {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;

    constructor(id: string, firstName: string, lastName: string, email: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}