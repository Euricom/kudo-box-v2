import { Controller, Get, Query, Request } from '@nestjs/common';
import { KudoMapper } from '../../kudo/api/mapper/kudo-mapper';
import { RequestWithUser } from '../../utils/api/request-with-user';
import { ApiDefaultControllerDoc } from '../../utils/api/swagger/api-default-controller-doc.decorator';
import { UserService } from '../service/user.service';
import { MyKudosDto } from './dto/out/my-kudos.dto';
import { UserDto } from './dto/out/User.dto';
import { UserMapper } from './mapper/user-mapper';

@Controller('user')
@ApiDefaultControllerDoc('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly kudoMapper: KudoMapper,
  ) {}

  @Get('me/kudos')
  async getLoggedInKudos(@Request() req: RequestWithUser): Promise<MyKudosDto> {
    const kudos = await this.userService.getKudosLoggedInUser(req.user);

    const receivedKudosDtos = await Promise.all(
      kudos
        .filter((k) => {
          return (
            (k.event &&
              k.event.host &&
              k.event.host.id === req.user.toUpperCase()) ||
            (k.receiver && k.receiver.id === req.user.toUpperCase())
          );
        })
        .map((k) => this.kudoMapper.toBasicKudoDto(k)),
    );
    const sentKudosDtos = await Promise.all(
      kudos
        .filter((k) => k.sender!.id === req.user.toUpperCase())
        .map((k) => this.kudoMapper.toBasicKudoDto(k)),
    );

    return new MyKudosDto(receivedKudosDtos, sentKudosDtos);
  }

  @Get('getByName')
  async getByName(@Query('name') name: string): Promise<UserDto[]> {
    const users = await this.userService.getByUserName(name);
    return users.map((e) => UserMapper.toUserDto(e));
  }
}
