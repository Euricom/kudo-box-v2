import { v4 as uuid } from 'uuid';
import { UserMapper } from "./user-mapper";
import { User } from "../../entities/user.entity";
import { InternalServerErrorException } from "@nestjs/common/exceptions";

describe('UserMapper', () => {

    describe('toUserDto', () => {
        it('User with Id, firstname, lastname and email', async () => {
            const testuser = new User(uuid(), 'Lennert', 'Moorthamer', 'lennert.moorthamer@test.be');

            const UserDto = UserMapper.toUserDto(testuser);

            expect(UserDto.id).toBeDefined();
            expect(UserDto.id).toBe(testuser.id);
            expect(UserDto.firstName).toBeDefined();
            expect(UserDto.firstName).toBe(testuser.firstName);
            expect(UserDto.lastName).toBeDefined();
            expect(UserDto.lastName).toBe(testuser.lastName);
            expect(UserDto.email).toBeDefined();
            expect(UserDto.email).toBe(testuser.email);
        })

        it('User without Id, firstname, lastname and email', async () => {
            const testuser = new User();

            try {
                await UserMapper.toUserDto(testuser);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const exc = e as InternalServerErrorException;
                expect(exc.message).toBe('Something went wrong getting your user')
            }
        })
    })
})
