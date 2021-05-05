import { Injectable } from '@nestjs/common';
import { KudoRepository } from '../data-access/kudo.repository';
import { Kudo } from '../entities/kudo.entity';
import { ImageClientService } from '../../../modules/image/service/image-client.service';
import { ImageEntityService } from '../../utils/image-entity.service';

@Injectable()
export class KudoService extends ImageEntityService<Kudo> {
  constructor(
    private readonly kudoRepo: KudoRepository,
    imageClient: ImageClientService
    ) {
      super(imageClient, kudoRepo);
    }

  findAll() {
    return `This action returns all kudo`;
  }

  findOne(id: string) {
    return `This action returns a #${id} kudo`;
  }

  update(id: string, kudo: Kudo) {
    return `This action updates a #${id} kudo`;
  }

  remove(id: string) {
    return `This action removes a #${id} kudo`;
  }
}
