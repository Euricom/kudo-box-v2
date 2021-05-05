import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { KudoRepository } from '../data-access/kudo.repository';
import { Kudo } from '../entities/kudo.entity';
import { ImageClientService } from './image-client.service';
import { ImageEntityService } from '../../utils/image-entity.service';

@Injectable()
export class KudoService extends ImageEntityService<Kudo> {
  constructor(
    private readonly kudoRepo: KudoRepository,
    imageClient: ImageClientService
    ) {
      super(imageClient, kudoRepo);
    }

  // async create(kudo: Kudo, kudoImage: Express.Multer.File): Promise<Kudo> {
  //   return this.createImageEntity(kudo, kudoImage, this.kudoRepo)
  //   // kudo.imageUrl = await this.imageClient.saveImage(kudoImage);

  //   // try {
  //   //   return this.kudoRepo.save(kudo);
  //   // } catch(_e) {
  //   //   await this.imageClient.deleteImage(kudo.imageUrl);
  //   //   throw new InternalServerErrorException(null, 'Something went wrong saving your kudo');
  //   // }
  // }

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
