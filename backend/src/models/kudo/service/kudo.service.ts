import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { KudoRepository } from '../data-access/kudo.repository';
import { Kudo } from '../entities/kudo.entity';
import { ImageClientService } from '../../../modules/image/service/image-client.service';
import { ImageEntityService } from '../../utils/image-entity.service';
import { EventService } from '../../event/service/event/event.service';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class KudoService extends ImageEntityService<Kudo> {
  constructor(
    private readonly eventService: EventService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly kudoRepo: KudoRepository,
    imageClient: ImageClientService
  ) {
    super(imageClient, kudoRepo);
  }

  async create(kudo: Kudo, kudoImage: Express.Multer.File): Promise<Kudo> {
    await this.validateNewKudo(kudo);
    return this.createImageEntity(kudo, kudoImage);
  }

  getKudosOfUser(userId: string): Promise<Kudo[]> {
    return this.kudoRepo.findByUserId(userId);
  }

  async getAllKudos(): Promise<Kudo[]> {
    return await (this.repo as KudoRepository).findKudos();
  }

  async getKudo(id: string): Promise<Kudo> {
    const kudo = await (this.repo as KudoRepository).findKudo(id);
    if (!kudo) throw new BadRequestException(null, `Kudo with id ${id} not found`);
    return kudo
  }

  async delete(id: string): Promise<void> {
    const kudo = await (this.repo as KudoRepository).findKudo(id);
    if (!kudo || !kudo.imageUrl) throw new BadRequestException(null, `Kudo with id ${id} not found`);
    this.deleteImageEntity(kudo.imageUrl);
    await (this.repo as KudoRepository).deleteKudo(id);
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
