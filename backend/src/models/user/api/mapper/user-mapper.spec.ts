import { GraphUser } from "src/modules/graph/service/graph-client"
import { v4 as uuid } from 'uuid';
import { UserMapper } from "./user-mapper";

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
})