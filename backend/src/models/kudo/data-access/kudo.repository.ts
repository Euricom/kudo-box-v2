import { EntityRepository, Repository } from "typeorm";
import { Kudo } from "../entities/kudo.entity";

@EntityRepository(Kudo)
export class KudoRepository extends Repository<Kudo> {
  findByUserId(userId: string): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
        .innerJoinAndSelect('kudo.sender', 'sender')
        .innerJoinAndSelect('kudo.receiver', 'receiver')
        .where('sender.id = :userId', { userId })
        .orWhere('receiver.id = :userId', { userId })
        .getMany();
  }

  findKudos(): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
      .getMany();
  }

  findKudo(id: string): Promise<Kudo | undefined> {
    return this.createQueryBuilder('kudo')
      .innerJoinAndSelect('kudo.sender', 'sender')
      .innerJoinAndSelect('kudo.receiver', 'receiver')
      .leftJoinAndSelect('kudo.event', 'event')
      .leftJoinAndSelect('event.ownedTag', 'ownedTag')
      .where('kudo.id = :kudoId', { kudoId: id })
      .getOne();
  }

  findKudosFiltered(filter: string): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
      .innerJoin('kudo.sender', 'sender')
      .leftJoin('kudo.receiver', 'receiver')
      .leftJoin('kudo.event', 'event')
      .leftJoin('event.ownedTag', 'ownedTag')
      .leftJoin('event.tags', 'tags')
      .where('UPPER(sender.firstname) like UPPER(:filter)', {filter: `%${filter}%`})
      .orWhere('UPPER(sender.lastname) like UPPER(:filter)', {filter: `%${filter}%`})
      .orWhere('UPPER(receiver.firstname) like UPPER(:filter)', {filter: `%${filter}%`})
      .orWhere('UPPER(receiver.lastname) like UPPER(:filter)', {filter: `%${filter}%`})
      .orWhere('UPPER(event.title) like UPPER(:filter)', {filter: `%${filter}%`})
      .orWhere('UPPER(ownedTag.name) like UPPER(:filter)', {filter: `%${filter}%`})
      .orWhere('UPPER(tags.name) like UPPER(:filter)', {filter: `%${filter}%`})
      .getMany();
  }
}

