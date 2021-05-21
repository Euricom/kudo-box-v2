import { Controller, Get, Request } from "@nestjs/common";
import { Kudo } from "src/models/kudo/entities/kudo.entity";
import { RequestWithUser } from "src/models/utils/api/request-with-user";
import { UserService } from "../service/user.service";
import { MyKudosDto } from "./dto/out/my-kudos.dto";


Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('me/kudos')
    async getLoggedInKudos(@Request() req: RequestWithUser): Promise<MyKudosDto[]> {
        const kudos = await this.userService.getKudosLoggedInUser(req.user);
        return Promise.resolve([])
    }
}