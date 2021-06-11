import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { KudoRepository } from '../data-access/kudo.repository';
import { Kudo } from '../entities/kudo.entity';
import { ImageClientService } from '../../../modules/image/service/image-client.service';
import { ImageEntityService } from '../../utils/image-entity.service';
import { EventService } from '../../event/service/event/event.service';
import { UserService } from '../../user/service/user.service';
import { EventEmitter2 } from 'eventemitter2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KudoService extends ImageEntityService<Kudo> {
  private readonly CREATED_KUDO_EVENT: string;

  constructor(
    @Inject(forwardRef(() => EventService)) private readonly eventService: EventService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly kudoRepo: KudoRepository,
    private readonly eventEmitter: EventEmitter2,
    imageClient: ImageClientService,
    configService: ConfigService
  ) {
    super(imageClient, kudoRepo);
    this.CREATED_KUDO_EVENT = configService.get<string>('EVENT_KUDO_CREATED')!;
  }

  async create(kudo: Kudo, kudoImage: Express.Multer.File): Promise<Kudo> {
    await this.validateNewKudo(kudo);
    const createdKudo = await this.createImageEntity(kudo, kudoImage);

    if(createdKudo.event?.id) this.eventEmitter.emit(this.CREATED_KUDO_EVENT, createdKudo);

    return createdKudo;
  }

  getKudosOfUser(userId: string): Promise<Kudo[]> {
    return this.kudoRepo.findByUserId(userId);
  }

  getKudosOfEvent(eventId: string) {
    return this.kudoRepo.findByEventId(eventId);
  }
  
  getKudos(filter?: string): Promise<Kudo[]> {
    if(filter) return (this.repo as KudoRepository).findKudosFiltered(filter);
    return (this.repo as KudoRepository).findKudos();
  }

  async getKudo(id: string): Promise<Kudo> {
    const kudo = await (this.repo as KudoRepository).findKudo(id);
    if (!kudo) throw new BadRequestException(null, `Kudo with id ${id} not found`);
    return kudo
  }

  async delete(id: string, userId: string): Promise<void> {
    const kudo = await (this.repo as KudoRepository).findKudo(id);
    if (!kudo || !kudo.imageUrl) throw new BadRequestException(null, `Kudo with id ${id} not found`);
    if (!kudo.receiver || !kudo.sender) throw new BadRequestException(null, `Kudo with id ${id} does not have a sender or receiver`);
    if (kudo.receiver.id!.toUpperCase() !== userId.toUpperCase() 
          && kudo.sender.id!.toUpperCase() !== userId.toUpperCase()) 
          throw new UnauthorizedException(null, `You are not authorized to delete this kudo`);
    this.deleteImageEntity(kudo.imageUrl);
    (this.repo as KudoRepository).deleteKudo(id);
  }

  private async validateNewKudo(kudo: Kudo): Promise<void> {
    if (!kudo.isNewValid()) throw new BadRequestException('kudo must have an event or receiver');

    const senderExists = await this.userService.userExists(kudo.sender!.id!)
    if (!senderExists) throw new BadRequestException(`Sender with id ${kudo.sender!.id} does not exist`);

    if (kudo.receiver) {
      const receiverExists = await this.userService.userExists(kudo.receiver.id!)
      if (!receiverExists) throw new BadRequestException(`Receiver with id ${kudo.receiver.id} does not exist`)
    }

    if (kudo.event) {
      const eventExists = await this.eventService.eventExists(kudo.event.id!);
      if (!eventExists) throw new BadRequestException(`Event with id ${kudo.event!.id} does not exist`);
    }
  }
}
