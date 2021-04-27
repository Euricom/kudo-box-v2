import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './api/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './data-access/user-repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository]
})
export class UserModule {}
