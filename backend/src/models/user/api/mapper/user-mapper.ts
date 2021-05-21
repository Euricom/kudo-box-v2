import { GraphUser } from '../../../../modules/graph/service/graph-client';
import { User } from '../../entities/user.entity';

export class UserMapper {
    static fromGraphUser(graphUser: GraphUser): User {
        let displayNameExistsRegex = new RegExp(`^${graphUser.givenName}`);

        if(displayNameExistsRegex.test(graphUser.displayName)) new User(graphUser.id, graphUser.givenName, graphUser.displayName.replace(`${graphUser.givenName} `, '') , graphUser.userPrincipalName);
        return new User(graphUser.id, graphUser.givenName, graphUser.displayName.replace(/^\S+ /, ''), graphUser.userPrincipalName);
    }
}