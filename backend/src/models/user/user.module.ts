import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KudoModule } from "../kudo/kudo.module";
import { UserRepository } from "./data-access/user.repository";
import { UserService } from "./service/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository]), KudoModule],
    providers: [UserService],
})
export class UserModule{}