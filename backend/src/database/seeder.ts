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
        const tag1 = new Tag('e29d0d75-6b5e-49c6-89b4-a8e6954f67a8', 'rxjs', undefined)
        const event1 = new Event('7a73e957-45ad-445d-b9f8-ebd6e2807f85', 'How to Rxjs', true, 'example.com', [], [], undefined, undefined, undefined, tag1);

        const tag2 = new Tag('cb4b49da-7c34-4313-91b1-d263516b013a', 'acc', undefined)
        const event2 = new Event('f14c73cd-133b-4944-af3a-883de2962267', 'Angular crash course', true, 'example.com', [], [], undefined, undefined, undefined, tag2);

        const tim = new User('faa39cc2-eb5a-4f1f-b7a3-c8335b773742', [event1], undefined, undefined);
        event1.host = tim;

        const lennert = new User('5a5dd307-0831-4fa6-a082-152713669da1', [event2], undefined, undefined);
        event2.host = lennert;

        await this.connection.createQueryBuilder()
            .insert()
            .into(User)
            .values([tim, lennert])
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Event)
            .values(event1)
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Event)
            .values(event2)
            .execute();

        tag1.events = [event1];
        tag2.events = [event2];

        await this.connection.createQueryBuilder()
            .relation(User, 'events')
            .of(tim)
            .add(event1);

        await this.connection.createQueryBuilder()
            .relation(User, 'events')
            .of(lennert)
            .add(event2);

        await this.connection.createQueryBuilder()
            .insert()
            .into(Tag)
            .values(tag1)
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Tag)
            .values(tag2)
            .execute();

        await this.connection.createQueryBuilder()
            .relation(Event, 'ownedTag')
            .of(event1)
            .set(tag1);

        await this.connection.createQueryBuilder()
            .relation(Event, 'ownedTag')
            .of(event2)
            .set(tag2);
        
    }

    private async seedUsers(): Promise<void> {
        

        
    }

}