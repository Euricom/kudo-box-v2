import { Injectable } from "@nestjs/common";
import { UserRepository } from "../data-access/user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository
    ) {}

    async userExists(id: string): Promise<boolean> {
        return !!(await this.userRepo.count({where: {id}}))
    }
}