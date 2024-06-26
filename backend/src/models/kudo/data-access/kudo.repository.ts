import { EntityRepository, Repository } from "typeorm";
import { Kudo } from "../entities/kudo.entity";

@EntityRepository(Kudo)
export class KudoRepository extends Repository<Kudo> {
  findByEventId(eventId: string) {
    return this.createQueryBuilder('kudo')
      .innerJoin('kudo.event', 'event')
      .where('event.id = :eventId', { eventId })
      .orderBy('kudo.sendDateTime', 'DESC')
      .getMany()
  }

  findByUserId(userId: string): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
      .innerJoinAndSelect('kudo.sender', 'sender')
      .leftJoinAndSelect('kudo.receiver', 'receiver')
      .leftJoinAndSelect('kudo.event', 'event')
      .leftJoinAndSelect('event.host', 'host')
      .where('sender.id = :userId', { userId })
      .orWhere('receiver.id = :userId', { userId })
      .orWhere('host.id = :userId', { userId })
      .orderBy('kudo.sendDateTime', 'DESC')
      .getMany();
  }

  findKudos(): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
      .innerJoin('kudo.event', 'event')
      .orderBy('kudo.sendDateTime', 'DESC')
      .getMany();
  }

  findKudo(id: string): Promise<Kudo | undefined> {
    return this.createQueryBuilder('kudo')
      .innerJoinAndSelect('kudo.sender', 'sender')
      .leftJoinAndSelect('kudo.receiver', 'receiver')
      .leftJoinAndSelect('kudo.event', 'event')
      .leftJoinAndSelect('event.ownedTag', 'ownedTag')
      .where('kudo.id = :kudoId', { kudoId: id })
      .getOne();
  }

  findKudosFiltered(filter: string): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
      .innerJoin('kudo.sender', 'sender')
      .leftJoin('kudo.receiver', 'receiver')
      .innerJoin('kudo.event', 'event')
      .innerJoin('event.ownedTag', 'ownedTag')
      .leftJoin('event.tags', 'tags')
      .where('UPPER(sender.firstname) like UPPER(:filter)', { filter: `%${filter}%` })
      .orWhere('UPPER(sender.lastname) like UPPER(:filter)', { filter: `%${filter}%` })
      .orWhere('UPPER(receiver.firstname) like UPPER(:filter)', { filter: `%${filter}%` })
      .orWhere('UPPER(receiver.lastname) like UPPER(:filter)', { filter: `%${filter}%` })
      .orWhere('UPPER(event.title) like UPPER(:filter)', { filter: `%${filter}%` })
      .orWhere('UPPER(ownedTag.name) like UPPER(:filter)', { filter: `%${filter}%` })
      .orWhere('UPPER(tags.name) like UPPER(:filter)', { filter: `%${filter}%` })
      .orderBy('kudo.sendDateTime', 'DESC')
      .getMany();
  }

  findAllOfEvent(eventId: string): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
      .innerJoin('kudo.event', 'event')
      .where('event.id = :eventId', { eventId })
      .getMany();
  }

  deleteKudo(id: string): void {
    this.createQueryBuilder()
      .delete()
      .from('kudo')
      .where("kudo.id = :kudoId", { kudoId: id })
      .execute();
  }
}

