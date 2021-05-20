import { GraphUser } from '../../../../modules/graph/service/graph-client';
import { User } from '../../entities/user.entity';

export class UserMapper {
    static fromGraphUser(graphUser: GraphUser): User {
        const lastName = graphUser.displayName.replace(`${graphUser.givenName} `, '');

        return new User(graphUser.id, graphUser.givenName, lastName, graphUser.userPrincipalName);
    }
}