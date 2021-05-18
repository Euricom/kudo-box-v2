import { EntityRepository, Repository } from "typeorm";
import { Kudo } from "../entities/kudo.entity";

@EntityRepository(Kudo)
export class KudoRepository extends Repository<Kudo> {
    async findKudos(): Promise<Kudo[]> {
        return this.createQueryBuilder('kudo')
        .innerJoinAndSelect('kudo.sender', 'sender')
        .innerJoinAndSelect('kudo.receiver', 'receiver')
        .innerJoinAndSelect('kudo.event', 'event')
        .getMany();
    }
}

