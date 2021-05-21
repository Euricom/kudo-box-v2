import { v4 as uuid } from 'uuid';
import { GraphUser } from "../../../../modules/graph/service/graph-client"
import { UserMapper } from "./user-mapper";
import { User } from "../../entities/user.entity";
import { InternalServerErrorException } from "@nestjs/common/exceptions";

describe('UserMapper', () => {
    describe('fromGraphUser', () => {
        it('Graph user with correct givenName returns valid User', () => {
            const graphUser: GraphUser = {
                id: uuid(),
                displayName: 'Tim François',
                givenName: 'Tim',
                userPrincipalName: 'tim@euri.com'
            }

            const user = UserMapper.fromGraphUser(graphUser);

            expect(user).toBeDefined();
            expect(user.id).toBe(graphUser.id);
            expect(user.firstname).toBe(graphUser.givenName);
            expect(user.lastname).toBe('François');
            expect(user.email).toBe(graphUser.userPrincipalName);
        })

        it('Graph user displayName does not contain givenName should return valid User', () => {
            const graphUser: GraphUser = {
                id: uuid(),
                displayName: 'Tim François',
                givenName: 'Bob',
                userPrincipalName: 'tim@euri.com'
            }

            const user = UserMapper.fromGraphUser(graphUser);

            expect(user).toBeDefined();
            expect(user.id).toBe(graphUser.id);
            expect(user.firstname).toBe(graphUser.givenName);
            expect(user.lastname).toBe('François');
            expect(user.email).toBe(graphUser.userPrincipalName);
        })
    })

    describe('toUserDto', () => {
        it('User with Id, firstname, lastname and email', async () => {
            const testuser = new User(uuid(), 'Lennert', 'Moorthamer', 'lennert.moorthamer@test.be');

            const UserDto = UserMapper.toUserDto(testuser);

            expect(UserDto.id).toBeDefined();
            expect(UserDto.id).toBe(testuser.id);
            expect(UserDto.firstName).toBeDefined();
            expect(UserDto.firstName).toBe(testuser.firstname);
            expect(UserDto.lastName).toBeDefined();
            expect(UserDto.lastName).toBe(testuser.lastname);
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
