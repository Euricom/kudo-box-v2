import { BadRequestException, Injectable } from '@nestjs/common';
import { KudoRepository } from '../data-access/kudo.repository';
import { Kudo } from '../entities/kudo.entity';
import { ImageClientService } from '../../../modules/image/service/image-client.service';
import { ImageEntityService } from '../../utils/image-entity.service';
import { EventService } from 'src/models/event/service/event/event.service';
import { UserService } from 'src/models/user/service/user.service';

@Injectable()
export class KudoService extends ImageEntityService<Kudo> {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly kudoRepo: KudoRepository,
    imageClient: ImageClientService
    ) {
      super(imageClient, kudoRepo);
    }

  create(kudo: Kudo, kudoImage: Express.Multer.File): Promise<Kudo> {
    this.validateNewKudo(kudo);
    return this.createImageEntity(kudo, kudoImage);
    
  }

  // Might need refactor
  private async validateNewKudo(kudo: Kudo): Promise<void> {
    if(!kudo.isNewValid()) throw new BadRequestException('kudo must have an event or receiver');

    const senderExists = await this.userService.userExists(kudo.sender!.id!)
    if(!senderExists) throw new BadRequestException(`Sender with id ${kudo.sender!.id} does not exist`);

    if(kudo.receiver) {
      const receiverExists = await this.userService.userExists(kudo.receiver.id!)
      if(!receiverExists) throw new BadRequestException(`Receiver with id ${kudo.receiver.id} does not exist`)
    }

    if(kudo.event) {
      const eventExists = await this.eventService.eventExists(kudo.event.id!);
      if(!eventExists) throw new BadRequestException(`Event with id ${kudo.event!.id} does not exist`);
    }
  }
}
