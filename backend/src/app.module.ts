import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seeder } from './database/seeder';
import { AppConfigModule } from './config/app-config.module'; 
import { DbConfigurerService } from './config/db-configurer.service';
import { KudoModule } from './models/kudo/kudo.module';
import { EventModule } from './models/event/event.module';
import { ImageModule } from './modules/image/image.module';
import { SecurityModule } from './modules/security/security.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphModule } from './modules/graph/graph.module';
import { UserModule } from './models/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AppConfigModule,
    KudoModule,
    EventModule,
    ImageModule,
    SecurityModule,
    GraphModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useExisting: DbConfigurerService,
    }),
    EventEmitterModule.forRoot()
  ],
  providers: [Seeder],
})
export class AppModule { }
