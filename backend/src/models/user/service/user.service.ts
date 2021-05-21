import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Kudo } from "../../kudo/entities/kudo.entity";
import { KudoService } from "../../kudo/service/kudo.service";
import { UserRepository } from "../data-access/user.repository";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        @Inject(forwardRef(() => KudoService)) private readonly kudoService: KudoService
    ) {}

    async userExists(id: string): Promise<boolean> {
        return !!(await this.userRepo.count({where: {id}}))
    }

    getKudosLoggedInUser(userId: string): Promise<Kudo[]> {
        return this.kudoService.getKudosOfUser(userId);
    }
    
    addUsers(newUsers: User[]): Promise<User[]> {
        return this.userRepo.save(newUsers);
    }
}