import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    filterByUserName(name: string): Promise<User[]> {
        return this.createQueryBuilder('user')
        .where('UPPER(user.firstname) like UPPER(:name)', { name: `%${name}%` })
        .orWhere('UPPER(user.lastname) like UPPER(:name)', { name: `%${name}%` })
        .getMany();
    }
    
    findUserById(userId: string): Promise<User | undefined> {
        return this.findOne(userId);
    }
}