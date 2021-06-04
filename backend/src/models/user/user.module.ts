import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KudoModule } from "../kudo/kudo.module";
import { UserController } from "./api/user.controller";
import { UserRepository } from "./data-access/user.repository";
import { UserService } from "./service/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository]), forwardRef(() => KudoModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule{}