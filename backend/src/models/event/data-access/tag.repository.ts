import { throws } from "node:assert";
import { Connection, EntityRepository, Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
    constructor(private readonly connection: Connection) {
        super();
    }

    async countByName(tagName: string): Promise<number> {
        return (await this.count({ where: { _name: tagName }}));
    }

    async getTagsByEvent(mainEventIds: string[]): Promise<Tag[]> {
        const queryObjects = mainEventIds.map(id => ({ tags: {_id: id } }));

        // const test = await this.createQueryBuilder('tag')
        //     .where('tag.name = :tagName', { tagName: 'acc' })
        //     .execute();

        //     console.log('=======================')
        //     console.log(test);
        //     console.log('=======================')
        // return test;

        // return this.connection.createQueryBuilder(Tag, 'tag')
        //     .innerJoinAndSelect('tag.events', 'event')
        //     .where('event.id IN (:...eventIds)', { eventIds: mainEventIds } )
        //     .execute();

        const test = this.createQueryBuilder('tag')
            .innerJoin('tag.events', 'event')
            .where('event.title = :eventName', { eventName: 'How to Rxjs' })
            .getMany();

        return test;
    }
}