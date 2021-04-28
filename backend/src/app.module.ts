import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './models/user/user.module';
import { Seeder } from './database/seeder';
import { AppConfigModule } from './config/app-config.module'; 
import { DbConfigurerService } from './config/db-configurer.service';

@Module({
  imports: [
    AppConfigModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useExisting: DbConfigurerService,
    })
  ],
  controllers: [],
  providers: [Seeder],
})
export class AppModule { }
