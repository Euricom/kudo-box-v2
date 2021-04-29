import { Injectable } from '@nestjs/common';
import { KudoRepository } from '../data-access/kudo-repository';
import { Kudo } from '../entities/kudo.entity';
import { ImageClientService } from './image-client.service';

@Injectable()
export class KudoService {
  constructor(
    private readonly kudoRepo: KudoRepository,
    private readonly imageClient: ImageClientService
    ) {}

  async create(kudo: Kudo, kudoImage: Express.Multer.File): Promise<Kudo> {
    return this.imageClient.saveImage(kudoImage)
      .then((imageUrl) => {
        kudo.imageUrl = imageUrl;
        return this.kudoRepo.save(kudo);
      });
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
