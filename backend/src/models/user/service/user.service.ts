import { Injectable } from "@nestjs/common";
import { Kudo } from "src/models/kudo/entities/kudo.entity";
import { KudoService } from "src/models/kudo/service/kudo.service";
import { UserRepository } from "../data-access/user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly kudoService: KudoService
    ) {}

    async userExists(id: string): Promise<boolean> {
        return !!(await this.userRepo.count({where: {id}}))
    }

    getKudosLoggedInUser(userId: string): Promise<Kudo[]> {
        return this.kudoService.getKudosOfUser(userId)
    }
}