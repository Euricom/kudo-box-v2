import { Injectable } from '@nestjs/common';
import { KudoRepository } from '../data-access/kudo-repository';
import { Kudo } from '../entities/kudo.entity';

@Injectable()
export class KudoService {
  constructor(private readonly kudoRepo: KudoRepository) {}

  create(kudo: Kudo, kudoImage: Express.Multer.File) {
    return this.kudoRepo.save(kudo);
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
