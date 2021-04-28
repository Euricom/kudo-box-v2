import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seeder } from './database/seeder';
import { AppConfigModule } from './config/app-config.module'; 
import { DbConfigurerService } from './config/db-configurer.service';
import { KudoModule } from './models/kudo/kudo.module';

@Module({
  imports: [
    AppConfigModule,
    KudoModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useExisting: DbConfigurerService,
    })
  ],
  providers: [Seeder],
})
export class AppModule { }
