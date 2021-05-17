import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./data-access/user.repository";

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    providers: [],
    exports: []
})
export class UserModule{}