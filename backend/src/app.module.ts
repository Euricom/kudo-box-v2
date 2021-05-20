import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seeder } from './database/seeder';
import { AppConfigModule } from './config/app-config.module'; 
import { DbConfigurerService } from './config/db-configurer.service';
import { KudoModule } from './models/kudo/kudo.module';
import { EventModule } from './models/event/event.module';
import { ImageModule } from './modules/image/image.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphModule } from './modules/graph/graph.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AppConfigModule,
    KudoModule,
    EventModule,
    ImageModule,
    GraphModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useExisting: DbConfigurerService,
    }),
  ],
  providers: [Seeder],
})
export class AppModule { }
