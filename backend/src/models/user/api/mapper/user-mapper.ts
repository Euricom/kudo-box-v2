import { GraphUser } from '../../../../modules/graph/service/graph-client';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { User } from '../../entities/user.entity';
import { UserDto } from '../dto/out/User.dto';

export class UserMapper {
  static fromGraphUser(graphUser: GraphUser): User {
    const displayNameExistsRegex = new RegExp(`^${graphUser.givenName}`);

    if (displayNameExistsRegex.test(graphUser.displayName))
      new User(
        graphUser.id,
        graphUser.givenName,
        graphUser.displayName.replace(`${graphUser.givenName} `, ''),
        graphUser.userPrincipalName,
      );
    return new User(
      graphUser.id,
      graphUser.givenName,
      graphUser.displayName.replace(/^\S+ /, ''),
      graphUser.userPrincipalName,
    );
  }

  static toUserDto(user: User): UserDto {
    if (!user.id)
      throw new InternalServerErrorException(
        null,
        'Something went wrong getting your user',
      );
    if (!user.firstname)
      throw new InternalServerErrorException(
        null,
        'Something went wrong getting your user',
      );
    if (!user.lastname)
      throw new InternalServerErrorException(
        null,
        'Something went wrong getting your user',
      );
    if (!user.email)
      throw new InternalServerErrorException(
        null,
        'Something went wrong getting your user',
      );
    return new UserDto(user.id, user.firstname, user.lastname, user.email);
  }
}
