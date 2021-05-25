import { Controller, Get, Request } from "@nestjs/common";
import { KudoMapper } from "../../../models/kudo/api/mapper/kudo-mapper";
import { RequestWithUser } from "../../../models/utils/api/request-with-user";
import { ApiDefaultControllerDoc } from "../../../models/utils/api/swagger/api-default-controller-doc.decorator";
import { UserService } from "../service/user.service";
import { MyKudosDto } from "./dto/out/my-kudos.dto";

@Controller('user')
@ApiDefaultControllerDoc('User')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly kudoMapper: KudoMapper
    ) { }

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