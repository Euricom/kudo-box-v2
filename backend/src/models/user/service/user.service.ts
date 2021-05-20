import { Injectable } from "@nestjs/common";
import { UserRepository } from "../data-access/user.repository";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository
    ) {}

    async userExists(id: string): Promise<boolean> {
        return !!(await this.userRepo.count({where: {id}}))
    }

    addUsers(newUsers: User[]): Promise<User[]> {
        return this.userRepo.save(newUsers);
    }
}