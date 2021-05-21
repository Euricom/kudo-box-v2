import { GraphUser } from '../../../../modules/graph/service/graph-client';
import { User } from '../../entities/user.entity';

export class UserMapper {
    static fromGraphUser(graphUser: GraphUser): User {
        let lastName: string;
        let displayNameExistsRegex = new RegExp(`^${graphUser.givenName}`);

        if(displayNameExistsRegex.test(graphUser.displayName)) lastName = graphUser.displayName.replace(`${graphUser.givenName} `, '');
        else lastName = graphUser.displayName.replace(/^\S+ /, '');

        return new User(graphUser.id, graphUser.givenName, lastName, graphUser.userPrincipalName);
    }
}