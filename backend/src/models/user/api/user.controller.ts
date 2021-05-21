import { Controller, Get, Request } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { KudoMapper } from "src/models/kudo/api/mapper/kudo-mapper";
import { RequestWithUser } from "src/models/utils/api/request-with-user";
import { UserService } from "../service/user.service";
import { MyKudosDto } from "./dto/out/my-kudos.dto";

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly kudoMapper: KudoMapper
    ) {}

    @Get('me/kudos')
    async getLoggedInKudos(@Request() req: RequestWithUser): Promise<MyKudosDto> {
        const kudos = await this.userService.getKudosLoggedInUser(req.user);

        const receivedKudosDtos = await Promise.all(kudos.filter(k => k.receiver!.id === req.user)
            .map(k => this.kudoMapper.toBasicKudoDto(k)))
        const sentKudosDtos = await Promise.all(kudos.filter(k => k.sender!.id === req.user)
            .map(k => this.kudoMapper.toBasicKudoDto(k)))

        return new MyKudosDto(receivedKudosDtos, sentKudosDtos);
    }
}