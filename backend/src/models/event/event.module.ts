import { Module } from '@nestjs/common';
import { EventService } from './service/event/event.service';
import { EventController } from './api/event.controller';

@Module({
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
