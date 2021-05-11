import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from '../create-event/create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
