import { EntityRepository, Repository } from "typeorm";
import { Kudo } from "../entities/kudo.entity";

@EntityRepository(Kudo)
export class KudoRepository extends Repository<Kudo> {

  async findKudos(): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
      .getMany();
  }

  async findKudo(id: string): Promise<Kudo | undefined> {
    return this.createQueryBuilder('kudo')
      .innerJoinAndSelect('kudo.sender', 'sender')
      .innerJoinAndSelect('kudo.receiver', 'receiver')
      .leftJoinAndSelect('kudo.event', 'event')
      .leftJoinAndSelect('event.ownedTag', 'ownedTag')
      .where('kudo.id = :kudoId', { kudoId: id })
      .getOne();
  }
}

