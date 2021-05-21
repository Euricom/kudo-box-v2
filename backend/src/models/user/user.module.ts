import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KudoModule } from "../kudo/kudo.module";
import { UserRepository } from "./data-access/user.repository";
import { UserService } from "./service/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository]), forwardRef(() => KudoModule)],
    providers: [UserService],
    exports: [UserService, TypeOrmModule]
})
export class UserModule{}