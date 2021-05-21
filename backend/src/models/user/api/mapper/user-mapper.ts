import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { User } from "../../entities/user.entity";
import { UserDto } from "../dto/out/User.dto";


@Injectable()
export class UserMapper {
    constructor() { }

    static toUserDto(user: User): UserDto {
        if (!user.id) throw new InternalServerErrorException(null, 'Something went wrong getting your user');
        if (!user.firstName) throw new InternalServerErrorException(null, 'Something went wrong getting your user');
        if (!user.lastName) throw new InternalServerErrorException(null, 'Something went wrong getting your user');
        if (!user.email) throw new InternalServerErrorException(null, 'Something went wrong getting your user');
        return new UserDto(user.id, user.firstName, user.lastName, user.email)
    }

}