import { EntityRepository, Repository } from "typeorm";
import { Kudo } from "../entities/kudo.entity";

@EntityRepository(Kudo)
export class KudoRepository extends Repository<Kudo> {
  findByUserId(userId: string): Promise<Kudo[]> {
    return this.createQueryBuilder('kudo')
        .innerJoin('kudo.sender', 'sender')
        .innerJoin('kudo.receiver', 'receiver')
        .where('sender.id = :userId', { userId })
        .orWhere('receiver.id = :userId', { userId })
        .getMany();
  }
}