import { PartialType } from '@nestjs/mapped-types';
import { CreateKudoDto } from './create-kudo.dto';

export class UpdateKudoDto extends PartialType(CreateKudoDto) {}
