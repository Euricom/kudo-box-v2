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

  async deleteKudo(id: string): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from('kudo')
      .where("kudo.id = :kudoId", { kudoId: id })
      .execute();
  }
}

