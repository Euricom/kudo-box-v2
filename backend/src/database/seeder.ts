import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { Event } from "src/models/event/entities/event/event.entity";
import { Tag } from "src/models/event/entities/tag/tag.entity";
import { User } from "src/models/user/entities/user.entity";
import { Connection } from "typeorm";

@Injectable()
export class Seeder implements OnApplicationBootstrap {
    constructor(private connection: Connection){}

    onApplicationBootstrap() {
        if(process.env.NODE_ENV === 'dev') this.seedDatabase();
    }

    private async seedDatabase(): Promise<void> {
        const tag = new Tag('e29d0d75-6b5e-49c6-89b4-a8e6954f67a8', 'rxjs', undefined)
        const event = new Event('7a73e957-45ad-445d-b9f8-ebd6e2807f85', 'How to Rxjs', 'example.com', [], [tag], undefined, undefined, undefined);

        const tim = new User('faa39cc2-eb5a-4f1f-b7a3-c8335b773742', [event], undefined, undefined);
        event.host = tim;

        const lennert = new User('5a5dd307-0831-4fa6-a082-152713669da1', undefined, undefined, undefined);

        await this.connection.createQueryBuilder()
            .insert()
            .into(User)
            .values([tim, lennert])
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Event)
            .values(event)
            .execute();

        tag.events = [event];

        await this.connection.createQueryBuilder()
            .relation(User, 'events')
            .of(tim)
            .add(event);

        await this.connection.createQueryBuilder()
            .insert()
            .into(Tag)
            .values(tag)
            .execute();

        await this.connection.createQueryBuilder()
            .relation(Event, 'tags')
            .of(event)
            .add(tag);
        
    }

    private async seedUsers(): Promise<void> {
        

        
    }

}