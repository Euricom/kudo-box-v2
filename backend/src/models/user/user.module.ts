import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./data-access/user.repository";
import { User } from "./entities/user.entity";
import { UserService } from "./service/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule{}