import { Injectable } from '@nestjs/common';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventService {
  create(event: Event) {
    return 'This action adds a new event';
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, event: Event) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
