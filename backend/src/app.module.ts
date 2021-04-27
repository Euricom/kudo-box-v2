import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user/entities/user.entity';
import { UserModule } from './models/user/user.module';
import { Seeder } from './database/seeder';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      // host: 'ekudo.database.windows.net',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: '',
      database: 'ekudo-dev',
      entities: [User],
      synchronize: true
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, Seeder],
})
export class AppModule {}
